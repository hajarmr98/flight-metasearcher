const express = require('express')
const server = express()
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const axios = require('axios')
const port = 2424;



server.use(express.static('public'))

let buscarIata = async (origen,destino) => {
    let response = {
        ida:'',
        vuelta:'',
        val: true
    }
    await axios.get(`http://api.aviationstack.com/v1/cities?access_key=0a652144617594796a7e6bc4758b9e35&city_name=${origen}`)
    .then(res => {
        if(res.data.data.length === 0){
            response.val = false
        } else {
            response.ida = res.data.data[0].iata_code
        }
    })
    await axios.get(`http://api.aviationstack.com/v1/cities?access_key=0a652144617594796a7e6bc4758b9e35&city_name=${destino}`)
    .then(res => {
        if(res.data.data.length === 0){
            response.val = false
        }else {
            response.vuelta = res.data.data[0].iata_code
        }
    })

    return response
}

let buscarIataAirport = async (origen,destino) => {
    let response = {
        ida:'',
        vuelta:''
    }
    await axios.get(`http://api.aviationstack.com/v1/airports?access_key=0a652144617594796a7e6bc4758b9e35&city_iata_code=${origen}`)
    .then(res => {
        response.ida = []
        for(let x = 0; x < res.data.data.length; x++){
            response.ida.push(res.data.data[x].iata_code)
        }
    })
    await axios.get(`http://api.aviationstack.com/v1/airports?access_key=0a652144617594796a7e6bc4758b9e35&city_iata_code=${destino}`)
    .then(res => {
        response.vuelta = []
        for(let x = 0; x < res.data.data.length; x++){
            response.vuelta.push(res.data.data[x].iata_code)
        }
    })
    return response
}

let urlAdultosCzech = (num) => {
    let str1 = 'TRAVELLER_TYPE_';
    let res = '';
    for(let x = 0; x < num; x++){

        res += str1 + (x+1) + '=ADT&'
    }
    return res
}

let urlNiniosCzech = (num) => {
    let str = 'TRAVELLER_TYPE_'
    let res = '';
    for(let x = 0; x < num; x++){
        res += str + (x+1) + '=CHD&'
    }
    return res
}

let urlBebesCzech = (num) => {
    let str = 'HAS_INFANT_'
    let res = '';
    for(let x = 0; x < num; x++){
        res += str + (x+1) + '=TRUE&'
    }
    return res
}

let scrapearDatosEuroWings = async ({ida,vuelta},{ida: fechaIda,adultos,vuelta: fechaVuelta,ninios,bebes}) => {
    let ret = {
        valid: '',
        datosIda: '',
        datosVuelta: '',
        url: ''
    }
    let aeropuertos = await buscarIataAirport(ida,vuelta)
    ida = aeropuertos.ida
    vuelta = aeropuertos.vuelta
    try{
        let setWings;
        for(let x = 0; x < ida.length; x++){
            for(let y = 0; y < vuelta.length; y++){
                let url = `https://www.eurowings.com/es/reservar/vuelos/busqueda-de-vuelos.html?destination=${vuelta[y]}&triptype=r&origin=${ida[x]}&fromdate=${fechaIda}&todate=${fechaVuelta}&adults=${adultos}&childs=${ninios}&infants=${bebes}&lng=es-ES#/reservar-vuelos/select`
                const browser = await puppeteer.launch();
                const page = await browser.newPage();
                await page.goto(url);
                setWings = new Promise((resolve,rej) => {
                        setTimeout(async() => {
                            let body = await page.content()
                            const $ = cheerio.load(body)
                            if($('.a-message.a-message--invalid').length > 2 || $('.a-price.a-price--large').first().text() === ''){
                                ret.valid = false
                            }else{
                                ret.datosIda = {
                                    title: 'Vuelo de ida',
                                    empresa: 'Eurowings',
                                    origin: {
                                        aeropuertoSalida: $('#flightselection__outbound .m-ibe-flighttable__station').first().text(), 
                                        origen: $('.m-form-autocomplete__prefix').first().text(),
                                        horarioSalida: $('.a-headline.a-headline--h4.t-spacing--0').html(),
                                        fechaSalida: $('.o-ibe-flightselection__navigation-action-date').text().substring(10, 20)
                                    },
                                    destiny: {
                                            aeropuertoLlegada: $('#flightselection__outbound .m-ibe-flighttable__station').last().text(),
                                            destino: $('.a-headline.a-headline--h4.t-spacing--5').first().text().split('- ')[1],
                                            horarioLlegada: $('#flightselection__outbound .a-headline.a-headline--h4.t-spacing--0').text().substring(5,10)
                                        },
                                        price: $('.a-price.a-price--large').first().text(),
                                        duration: $('.m-ibe-flighttable__item').first().text().split(' ')[1],
                                        url: `https://www.eurowings.com/es/reservar/vuelos/busqueda-de-vuelos.html?destination=${vuelta[y]}&origin=${ida[x]}&fromdate=${fechaIda}&triptype=oneway&adults=${adultos}&childs=${ninios}&infants=${bebes}&lng=es-ES#/reservar-vuelos/select`
                                    }
                                ret.datosVuelta = {
                                            title: 'Vuelo de Vuelta',
                                            empresa: 'Eurowings',
                                            origin: {
                                                    aeropuertoSalida: $('#flightselection__inbound .m-ibe-flighttable__station').first().text(),
                                                    origen: $('.a-headline.a-headline--h4.t-spacing--5').first().text().split('- ')[1] ,
                                                    horarioSalida: $('#flightselection__inbound .m-ibe-flighttable__item-cell.m-ibe-flighttable__flight .a-headline.a-headline--h4.t-spacing--0').first().text(),
                                                    fechaSalida: $('#flightselection__inbound .o-ibe-flightselection__navigation-action-date').text().substring(10, 19),
                                    },
                                    destiny: {
                                            aeropuertoLlegada: $('#flightselection__inbound .m-ibe-flighttable__station').last().text(),
                                            destino: $('.m-form-autocomplete__prefix').first().text(),
                                            horarioLlegada: $('#flightselection__inbound .m-ibe-flighttable__item-cell.m-ibe-flighttable__flight.m-ibe-flighttable__flight--right .a-headline.a-headline--h4.t-spacing--0').last().text(),
                                    },
                                    price: $('#flightselection__inbound .a-price.a-price--large').first().text(),
                                    duration: $('#flightselection__inbound .m-ibe-flighttable__duration').first().text(),
                                    url: `https://www.eurowings.com/es/reservar/vuelos/busqueda-de-vuelos.html?destination=${ida[x]}&origin=${vuelta[y]}&fromdate=${fechaVuelta}&triptype=oneway&adults=${adultos}&childs=${ninios}&infants=${bebes}&lng=es-ES#/reservar-vuelos/select`
                                }
                                ret.valid = true
                                ret.url = url
                            }
                            browser.close()
                            resolve(ret)
                        }, 6000)
                    })
                    await setWings
                    if(ret.valid){
                        break;
                    }
            }
            if(ret.valid){
                break;
            }
        }
        return setWings
    }catch(err){
        throw err
    }
}

let scrapearDatosCzech = async ({ida,vuelta},{ida: fechaIda,adultos,vuelta: fechaVuelta,ninios,bebes}) => {
    let ret = {
        valid: '',
        datosIda: '',
        datosVuelta: '',
        url: ''
    }
    let adults = urlAdultosCzech(adultos);
    let nini = '';
    let bebis = '';
    if(ninios > 0){
        nini = urlNiniosCzech(ninios)
    }
    if(bebes > 0){
        bebis = urlBebesCzech(bebes)
    }
    let aeropuertos = await buscarIataAirport(ida,vuelta)
    ida = aeropuertos.ida
    vuelta = aeropuertos.vuelta
    try{
        let setCzech;
        for(x = 0; x < ida.length; x++){
            for(y = 0; y < vuelta.length; y++){
                let url = `https://book.csa.cz/plnext/czech_DX/Override.action?${adults}${nini}${bebis}TRIP_FLOW=YES&BOOKING_FLOW=REVENUE&B_LOCATION_1=${ida[x]}&E_LOCATION_1=${vuelta[y]}&B_DATE_1=${fechaIda}0000&B_ANY_TIME_1=TRUE&B_DATE_2=${fechaVuelta}0000&B_ANY_TIME_2=TRUE&TRIP_TYPE=R&B_LOCATION_2=MAD&E_LOCATION_2=BCN&SO_SITE_POINT_OF_SALE=MAD&SO_SITE_USER_CURRENCY_CODE=&SO_SITE_MARKET_ID=ES&PRICING_TYPE=O&EMBEDDED_TRANSACTION=FlexPricerAvailability&DISPLAY_TYPE=2&ARRANGE_BY=D&REFRESH=0&COMMERCIAL_FARE_FAMILY_1=CFFOKWEB&DATE_RANGE_VALUE_1=3&DATE_RANGE_VALUE_2=3&DATE_RANGE_QUALIFIER_1=C&DATE_RANGE_QUALIFIER_2=C&EXTERNAL_ID=172.1.2.3&SITE=P02YP02Y&LANGUAGE=ES&SO_SITE_INS_MARKET_COUNTRY=ES&SO_SITE_AIRLINE_CODE=OK&SO_SITE_IS_INSURANCE_ENABLED=TRUE#/FPOW`
                const browser = await puppeteer.launch();
                const page = await browser.newPage();
                await page.goto(url);
                setCzech = new Promise((resolve,reject) => {
                    setTimeout(async () => {
                        let body = await page.content()
                        const $ = cheerio.load(body)
                        if($('#global-error-message').html() === null && $('#alert-title-global-warning-message').html() === null){
                                ret.datosIda = {
                                    title: 'Vuelo de ida',
                                    empresa: 'Czech Airlines',
                                    origin: {
                                        aeropuertoSalida: $('.flight-details-airport').first().text(),
                                        origen: $('.flight-details-city').first().html().split("</span> ")[1].split('\n')[0],
                                        horarioSalida: $('.flight-details-city').first().children().text().split('\n')[1],
                                        fechaSalida: $('.tripsummary-title.tripsummary-date.tripsummary-details').first().children().last().text()
                                    },
                                    destiny: {
                                        aeropuertoLlegada: $('.flight-details-arrival > .flight-details-airport').first().text(),
                                        destino: $('.flight-details-arrival > .flight-details-city').first().text().split(' ')[1],
                                        horarioLlegada: $('.flight-details-arrival > .flight-details-city').first().text().split(' ')[0]
                                    },
                                    price: $('.availability-group-cell-price > .cell-reco-currency').first().text() + ' ' + $('#tpl4_upsell-calendar-bound0_cell-price-selected-bound-0 .price').first().text(),
                                    duration: $('.duration').children().text().split(',')[0],
                                    url: `https://book.csa.cz/plnext/czech_DX/Override.action?${adults}${nini}${bebis}&TRIP_FLOW=YES&BOOKING_FLOW=REVENUE&B_LOCATION_1=${ida[x]}&E_LOCATION_1=${vuelta[y]}&B_DATE_1=${fechaIda}0000&B_ANY_TIME_1=TRUE&TRIP_TYPE=O&SO_SITE_POINT_OF_SALE=MAD&SO_SITE_USER_CURRENCY_CODE=&SO_SITE_MARKET_ID=ES&PRICING_TYPE=O&EMBEDDED_TRANSACTION=FlexPricerAvailability&DISPLAY_TYPE=2&ARRANGE_BY=D&REFRESH=0&COMMERCIAL_FARE_FAMILY_1=CFFOKWEB&DATE_RANGE_VALUE_1=3&DATE_RANGE_VALUE_2=3&DATE_RANGE_QUALIFIER_1=C&DATE_RANGE_QUALIFIER_2=C&EXTERNAL_ID=172.1.2.3&SITE=P02YP02Y&LANGUAGE=ES&SO_SITE_INS_MARKET_COUNTRY=ES&SO_SITE_AIRLINE_CODE=OK&SO_SITE_IS_INSURANCE_ENABLED=TRUE#/FPOW`
                                }
                                ret.datosVuelta = {
                                    title: 'Vuelo de Vuelta',
                                    empresa: 'Czech Airlines',
                                    origin: {
                                        aeropuertoSalida: $('.flight-details-departure .flight-details-airport').last().text(),
                                        origen: $('.flight-details-arrival > .flight-details-city').first().text().split(' ')[1],
                                        horarioSalida: $('.flight-details-departure .flight-details-city').last().html().split('</span> ')[0].split('\n')[2],
                                        fechaSalida: $('.tripsummary-title.tripsummary-date.tripsummary-details').last().children().last().text()
                                    },
                                    destiny: {
                                        aeropuertoLlegada: $('.flight-details-arrival > .flight-details-airport').last().text(),
                                        destino: $('.flight-details-arrival > .flight-details-city').last().text().split(' ')[1],
                                        horarioLlegada: $('.flight-details-arrival > .flight-details-city').last().text().split(' ')[0]
                                    },
                                    price: $('.availability-group-cell-price > .cell-reco-currency').first().text() + ' ' + $('#tpl4_upsell-calendar-bound1_cell-price-selected-bound-1 .price').last().text(),
                                    duration: $('.duration').children().last().text().split(',')[0],
                                    url: `https://book.csa.cz/plnext/czech_DX/Override.action?${adults}${nini}${bebis}&TRIP_FLOW=YES&BOOKING_FLOW=REVENUE&B_LOCATION_1=${vuelta[y]}&E_LOCATION_1=${ida[x]}&B_DATE_1=${fechaVuelta}0000&B_ANY_TIME_1=TRUE&TRIP_TYPE=O&SO_SITE_POINT_OF_SALE=MAD&SO_SITE_USER_CURRENCY_CODE=&SO_SITE_MARKET_ID=ES&PRICING_TYPE=O&EMBEDDED_TRANSACTION=FlexPricerAvailability&DISPLAY_TYPE=2&ARRANGE_BY=D&REFRESH=0&COMMERCIAL_FARE_FAMILY_1=CFFOKWEB&DATE_RANGE_VALUE_1=3&DATE_RANGE_VALUE_2=3&DATE_RANGE_QUALIFIER_1=C&DATE_RANGE_QUALIFIER_2=C&EXTERNAL_ID=172.1.2.3&SITE=P02YP02Y&LANGUAGE=ES&SO_SITE_INS_MARKET_COUNTRY=ES&SO_SITE_AIRLINE_CODE=OK&SO_SITE_IS_INSURANCE_ENABLED=TRUE#/FPOW`
                                    
                                }
                                ret.valid = true
                                ret.url = url
                            } else {
                                ret.valid = false
                            }
                            browser.close()
                            resolve(ret)
                        },5000)
                    })
                await setCzech
                if(ret.valid){
                    break;
                }
            }
            if(ret.valid){
                break;
            }
        }
        return setCzech
    }catch(err){
        throw err
    } 
}

let compararPreciosIda = (aerolineas) => {

    let validCzech = aerolineas[1].valid
    let validEuro = aerolineas[0].valid
    
    if(validCzech && validEuro){
        let czech = aerolineas[1].datosIda
        let czechPrice = czech.price.split(' ')[1].replace(',','.')
        let czechIntegerIda = parseFloat(czechPrice)   
        
        let euro = aerolineas[0].datosIda
        let euroPrice = euro.price.split(' ')[0].replace(',','.')
        let euroIntegerIda = parseFloat(euroPrice)
        
        if (czechIntegerIda > euroIntegerIda) {
        return aerolineas[0].datosIda
        } else if (euroIntegerIda > czechIntegerIda) {
         return aerolineas[1].datosIda
        } else {
          return aerolineas[Math.floor(Math.random() * 2)].datosIda
        }

    }else if(validCzech && !validEuro) {
        return aerolineas[1].datosIda
    } else if(!validCzech && validEuro){
        return aerolineas[0].datosIda
    } else {
        return false
    }
}

let compararPreciosVuelta = (aerolineas) => {
    let validCzech = aerolineas[1].valid
    let validEuro = aerolineas[0].valid
    
    if(validCzech && validEuro){
        let czech = aerolineas[1].datosVuelta
        let czechPrice = czech.price.split(' ')[1].replace(',','.')
        let czechIntegerIda = parseFloat(czechPrice)   
        
        let euro = aerolineas[0].datosVuelta
        let euroPrice = euro.price.split(' ')[0].replace(',','.')
        let euroIntegerIda = parseFloat(euroPrice)
        if (czechIntegerIda > euroIntegerIda) {

        return aerolineas[0].datosVuelta
        } else if (euroIntegerIda > czechIntegerIda) {
         return aerolineas[1].datosVuelta
        } else {
          return aerolineas[Math.floor(Math.random() * 2)].datosVuelta
        }

    }else if(validCzech && !validEuro) {
        return aerolineas[1].datosVuelta
    } else if(!validCzech && validEuro){
        return aerolineas[0].datosVuelta
    } else {
        return false
    }
}


let buscarVuelos = async (res,datos) => {
    let aerolineas = [];
    let final = {
        val: '',
        objetoIda : '',
        objetoVuelta : '',
        url: []
    }
    try{
        let euroW = await scrapearDatosEuroWings(res,datos)
        datos.ida = datos.ida.split('-').join('')
        datos.vuelta = datos.vuelta.split('-').join('')
        let czechA = await scrapearDatosCzech(res,datos)
        aerolineas.push(euroW)
        aerolineas.push(czechA)
        let idaVal = compararPreciosIda(aerolineas)
        let vueltaVal = compararPreciosVuelta(aerolineas)
        if(!idaVal && !vueltaVal){
            final.val = false
        } else if(!idaVal){
            final.val = true
            final.objetoVuelta = vueltaVal
        } else if(!vueltaVal){
            final.val = true
            final.objetoIda = idaVal
        } else {
            final.val = true
            final.objetoIda = idaVal
            final.objetoVuelta = vueltaVal
        }

        if(final.objetoVuelta.empresa === 'Eurowings' && final.objetoIda.empresa === 'Eurowings'){
            final.url.push(euroW.url)
        } else if(final.objetoVuelta.empresa === 'Czech Airlines' && final.objetoIda.empresa === 'Czech Airlines') {
            final.url.push(czechA.url)
        } else{
            final.url.push(final.objetoIda.url, final.objetoVuelta.url)
        }
        return final

    } catch(err){
        console.log(err)
    } 
}


server.get('/', (req, res) => res.sendfile(__dirname + '/index.html'))

server.get('/flights/from/:origen/to/:destino/date_1/:ida/adults/:adultos/date_2/:vuelta/kids/:ninios/age/:bebes',(req,res) => {
    let collectData = {
        origen: req.params.origen,
        destino: req.params.destino,
        ida: req.params.ida,
        adultos: req.params.adultos,
        vuelta: req.params.vuelta,
        ninios: req.params.ninios,
        bebes: req.params.bebes
    }

    buscarIata(collectData.origen,collectData.destino)
    .then(async resp => {
        try{
            let vueloMasBarat;
            if(resp.val){
                vueloMasBarat = await buscarVuelos(resp,collectData)
            }else {
                vueloMasBarat = resp
            }
           res.send(vueloMasBarat)
        } catch(err) {
            console.log(err)
        }
    })
    
})

server.listen(port,() => console.log('Running in port: ' + port))