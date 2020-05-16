import server from './server'
import socket from './socket'
import dotenv from 'dotenv'
import https from 'https'
import spdy from 'spdy'
import path from 'path'
import fs from 'fs'
import { EventEmitter } from 'events'

dotenv.config({silent: true})
  var __options = {}
// Initiate WEB SOCKET:
  var WS = require('websocket').server
  var WSR = require('websocket').router
//let app = express(), server
__options.ENV = process.env.NODE_ENV || 'development'
__options.PORT = process.env.NODE_ENV==='production'? process.env.PORT || 8080 : 8080
__options.CURENT_CITY = process.env.SINGLE_CITY > 0 ? process.env.SINGLE_CITY : 0

server.start(__options)
.then( server => {
// # WebSocket-Node Server #
  socket.open(server)
})


// Instantiate EVENT EMITTER:
const mediator = new EventEmitter()
mediator.on('baker.login', () => {
  console.log('Baker Here!')
})



const options = {
    key: fs.readFileSync(__dirname + '/ssl/server.key', 'utf8'),
    cert:fs.readFileSync(__dirname + '/ssl/server.srt', 'utf8')
  }

//if(ENV==='production') {
//// TRY HTTP2: no ssl-file
//  const options = {
//    key: fs.readFileSync(__dirname + '/ssl/server.key', 'utf8'),
//    cert:fs.readFileSync(__dirname + '/ssl/server.srt', 'utf8')
//  }
//  server = https.createServer(options,app).listen(PORT, error => {
//    if(error){
//      console.log(error)
//      return process.exit(1)
//    } else {
//      console.log('HTTPS running on: ', PORT)
//    }
//  })
//} else {
  // server = app.listen(PORT, () => console.log('Server Running on: ',PORT) )
//}
