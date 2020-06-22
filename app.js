const express = require('express')
const server = express()
const cheerio = require('cheerio')
const port = 2424

server.use(express.static('public'))


server.get('/',(req,res) => res.sendfile(__dirname + '/index.html'))

server.listen(port,() => console.log('Running in port: ' + port))