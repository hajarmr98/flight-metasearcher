const express = require('express')
const server = express()
const request = require('request')
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const fs = require('fs')
const port = 2424


server.use(express.static('public'))


server.get('/',(req,res) => res.sendfile(__dirname + '/index.html'))

server.get('/flights/from/:origen/to/:destino/date_1/:ida/adults/:adultos/date_2/:vuelta/kids/:ninios/age/:edad',(req,res) => {
    let collectData = {
        origen: req.params.origen,
        destino: req.params.destino,
        ida: req.params.ida,
        adultos: req.params.adultos,
        vuelta: req.params.vuelta,
        ninios: req.params.ninios,
        edad: req.params.edad
    }
    
    let scrapearDatosCzech = async () => {
        let ret = {
            datosIda: '',
            datosVuelta: ''
        }
        try{
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto("https://book.csa.cz/plnext/czech_DX/Override.action?TRAVELLER_TYPE_1=ADT&TRIP_FLOW=YES&BOOKING_FLOW=REVENUE&B_LOCATION_1=BCN&E_LOCATION_1=PRG&B_DATE_1=202010220000&B_ANY_TIME_1=TRUE&B_DATE_2=202010290000&B_ANY_TIME_2=TRUE&TRIP_TYPE=R&B_LOCATION_2=PRG&E_LOCATION_2=BCN&SO_SITE_POINT_OF_SALE=MAD&SO_SITE_USER_CURRENCY_CODE=&SO_SITE_MARKET_ID=ES&PRICING_TYPE=O&EMBEDDED_TRANSACTION=FlexPricerAvailability&DISPLAY_TYPE=2&ARRANGE_BY=D&REFRESH=0&COMMERCIAL_FARE_FAMILY_1=CFFOKWEB&DATE_RANGE_VALUE_1=3&DATE_RANGE_VALUE_2=3&DATE_RANGE_QUALIFIER_1=C&DATE_RANGE_QUALIFIER_2=C&EXTERNAL_ID=172.1.2.3&SITE=P02YP02Y&LANGUAGE=ES&SO_SITE_INS_MARKET_COUNTRY=ES&SO_SITE_AIRLINE_CODE=OK&SO_SITE_IS_INSURANCE_ENABLED=TRUE#/FPOW");
            setTimeout(async () => {
                let body = await page.content()
                const $ = cheerio.load(body)
                
                
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
                    price: $('.availability-group-cell-price > .cell-reco-currency').first().text() + ' ' + $('.cell-reco-bestprice-integer.availability-font-xlarge').first().text(),
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
                    price: $('.availability-group-cell-price > .cell-reco-currency').first().text() + ' ' + $('.cell-reco-bestprice-integer.availability-font-xlarge').text().substring(20, 25),
                    duration: $('.duration').children().last().text().split(',')[0]
                }
                browser.close()
                res.send(JSON.stringify(ret))
            },5000)
        }catch(err){
            throw err
        } 
        
    }

    scrapearDatosCzech()
    
})

server.listen(port,() => console.log('Running in port: ' + port))