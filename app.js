const express = require('express')
const server = express()
const request = require('request')
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const axios = require('axios')
const port = 2424

server.use(express.static('public'))

let buscarIata = async (origen,destino) => {
    let response = {
        ida:'',
        vuelta:''
    }
    await axios.get(`http://api.aviationstack.com/v1/cities?access_key=17257fb3bb99b705fbba913e8d3cfcb8&city_name=${origen}`)
    .then(res => {
        response.ida = res.data.data[0].iata_code
    })
    await axios.get(`http://api.aviationstack.com/v1/cities?access_key=17257fb3bb99b705fbba913e8d3cfcb8&city_name=${destino}`)
    .then(res => {
        response.vuelta = res.data.data[0].iata_code
    })

    return response
}

let buscarIataAirport = async (origen,destino) => {
    let response = {
        ida:'',
        vuelta:''
    }
    await axios.get(`http://api.aviationstack.com/v1/airports?access_key=17257fb3bb99b705fbba913e8d3cfcb8&city_iata_code=${origen}`)
    .then(res => {
        response.ida = res.data.data[0].iata_code
    })
    await axios.get(`http://api.aviationstack.com/v1/airports?access_key=17257fb3bb99b705fbba913e8d3cfcb8&city_iata_code=${destino}`)
    .then(res => {
        response.vuelta = res.data.data[0].iata_code
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
        datosVuelta: ''
    }
    buscarIataAirport(ida,vuelta)
    .then(res => {
        ida = res.ida
        vuelta = res.vuelta
    } )
    let url = `https://www.eurowings.com/es/reservar/vuelos/busqueda-de-vuelos.html?destination=${vuelta}&triptype=r&origin=${ida}&fromdate=${fechaIda}&todate=${fechaVuelta}&adults=${adultos}&childs=${ninios}&infants=${bebes}&lng=es-ES#/reservar-vuelos/select`
    console.log(url)
    try{
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
            const setWings = new Promise((resolve,rej) => {
                setTimeout(async() => {
                    let body = await page.content()
                    const $ = cheerio.load(body)

                    if($('.a-message.a-message--invalid').length > 2){
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
                                duration: $('.m-ibe-flighttable__item').first().text().split(' ')[1]
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
                        }
                        ret.valid = true
                    }
                    browser.close()
                    resolve(ret)
            }, 6000)
        })
        return setWings
    }catch(err){
        throw err
    }
}

let scrapearDatosCzech = async ({ida,vuelta},{ida: fechaIda,adultos,vuelta: fechaVuelta,ninios,bebes}) => {
    let ret = {
        valid: '',
        datosIda: '',
        datosVuelta: ''
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
    let url = `https://book.csa.cz/plnext/czech_DX/Override.action?${adults}${nini}${bebis}TRIP_FLOW=YES&BOOKING_FLOW=REVENUE&B_LOCATION_1=${ida}&E_LOCATION_1=${vuelta}&B_DATE_1=${fechaIda}0000&B_ANY_TIME_1=TRUE&B_DATE_2=${fechaVuelta}0000&B_ANY_TIME_2=TRUE&TRIP_TYPE=R&B_LOCATION_2=MAD&E_LOCATION_2=BCN&SO_SITE_POINT_OF_SALE=MAD&SO_SITE_USER_CURRENCY_CODE=&SO_SITE_MARKET_ID=ES&PRICING_TYPE=O&EMBEDDED_TRANSACTION=FlexPricerAvailability&DISPLAY_TYPE=2&ARRANGE_BY=D&REFRESH=0&COMMERCIAL_FARE_FAMILY_1=CFFOKWEB&DATE_RANGE_VALUE_1=3&DATE_RANGE_VALUE_2=3&DATE_RANGE_QUALIFIER_1=C&DATE_RANGE_QUALIFIER_2=C&EXTERNAL_ID=172.1.2.3&SITE=P02YP02Y&LANGUAGE=ES&SO_SITE_INS_MARKET_COUNTRY=ES&SO_SITE_AIRLINE_CODE=OK&SO_SITE_IS_INSURANCE_ENABLED=TRUE#/FPOW`
    try{
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        let setCzech = new Promise((resolve,reject) => {
            setTimeout(async () => {
                    let body = await page.content()
                    const $ = cheerio.load(body)
                    if($('#global-error-message').html() === null){
                        ret.datosIda = {
                            title: 'Vuelo de ida',
                            empresa: $('.airline-name').first().text(),
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
                            price: $('.availability-group-cell-price > .cell-reco-currency').first().text() + ' ' + $('.price').first().text(),
                            duration: $('.duration').children().text().split(',')[0]
                        }
                        ret.datosVuelta = {
                            title: 'Vuelo de Vuelta',
                            empresa: $('.airline-name').first().text(),
                            origin: {
                                aeropuertoSalida: $('.flight-details-departure .flight-details-airport').last().text(),
                                origen: $('.flight-details-departure .flight-details-city').last().html().split('</span> ')[1].split('\n')[0],
                                horarioSalida: $('.flight-details-departure .flight-details-city').last().html().split('</span> ')[0].split('\n')[2],
                                fechaSalida: $('.tripsummary-title.tripsummary-date.tripsummary-details').last().children().last().text()
                            },
                            destiny: {
                                aeropuertoLlegada: $('.flight-details-arrival > .flight-details-airport').last().text(),
                                destino: $('.flight-details-arrival > .flight-details-city').last().text().split(' ')[1],
                                horarioLlegada: $('.flight-details-arrival > .flight-details-city').last().text().split(' ')[0]
                            },
                            price: $('.availability-group-cell-price > .cell-reco-currency').first().text() + ' ' + $('.price').last().text(),
                            duration: $('.duration').children().last().text().split(',')[0]
                        }
                        ret.valid = true
                    } else {
                        ret.valid = false
                    }
                    browser.close()
                    resolve(ret)
                },5000)
            })
        return setCzech
    }catch(err){
        throw err
    } 
}


let buscarVuelos = async (res,datos) => {
    let aerolineas = [];
    try{
        let euroW = await scrapearDatosEuroWings(res,datos)
        datos.ida = datos.ida.split('-').join('')
        datos.vuelta = datos.vuelta.split('-').join('')
        let czechA = await scrapearDatosCzech(res,datos)
        aerolineas.push(euroW)
        aerolineas.push(czechA)
        compararPrecios(aerolineas)
    } catch(err){
        console.log(err)
    }
}

server.get('/',(req,res) => res.sendfile(__dirname + '/index.html'))

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
           let vueloMasBarat = await buscarVuelos(resp,collectData)
        } catch(err) {
            console.log(err)
        }
    })
    
})

server.listen(port,() => console.log('Running in port: ' + port))




