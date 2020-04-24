import express from 'express'
import spdy from 'spdy'
import path from 'path'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import requestLanguage from 'express-request-language'
import authRouter from './routes/auth'
import userRouter from './routes/user'
import adminRouter from './routes/admin'
import productRouter from './routes/product'
import orderRouter from './routes/order'
import api from './api/'
import { getLan,orderListener,adminRouterHit } from './middleware/'
import { EventEmitter } from 'events'

dotenv.config({silent: true})
let app = express()
let PORT = process.env.PORT || 8080
let ENV = process.env.NODE_ENV || 'development'
let CURRENT_CITY = process.env.SINGLE_CITY > 0 ? process.env.SINGLE_CITY : 0

// Initiate WEB SOCKET:
let WS = require('websocket').server
let WSR = require('websocket').router
// WS Connection Objects List: user,ref,dlv,pos,baker,fac,lab,root
let uconn=[], rconn=[], dconn=[], pconn=[], bconn=[], fconn=[], lconn=[], rootconn=[]
// WS protocols:
var prtc = ['root','lab','fac','baker','pos','dlv','test','rep','customer']

// Instantiate EVENT EMITTER:
const mediator = new EventEmitter()
mediator.on('baker.login', () => {
  console.log('Baker Here!')
})

app.use('/static', express.static(path.join(__dirname, '../client/build/static')) )
app.use('/img', express.static(path.join(__dirname, '../client/build/img')) )
if(ENV === 'production') app.use(express.static(path.join(__dirname, '../client/build')) )

// == ROUTES & ROUTERS =====================================
app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/admin', (req,res,next) => {
  req.mediator = mediator
  next()
}, adminRouter)
app.use('/products', productRouter)
app.use('/orders', orderRouter)

// ========================================================

app.get('/ui', getLan, (req,res,next) => {
  let data = {}
  let params = {
    c_status: 4
  }
  const { lan } = req
// SWITCH to:    req.language// === 'en' ? 'bg' : req.language
  //if(lng === 'lan') {
  //  data.lan = req.language==='es'? 'es' : 'bg'
  //} else {
  data.lan = lan
  if(!!CURRENT_CITY) data.city = Number(CURRENT_CITY)
  //}
// get cities: ? add params {c_status: 4} if needed
  api.getList('city',['name','id','zone','code','alt'],params).then( response => {//,{c_status: 4}
    const cty = response.map( entry => {
//switch BG to req.language in production
      return {
        title: JSON.parse(entry.name)[data.lan],
        id: entry.id,
        //status: entry.c_status,
        alt: entry.alt ? JSON.parse(entry.alt)[data.lan] : NULL
      }
    })
    data.cities = cty
    data.mob = req.get('user-agent').match((/(Mobile)/g)) ? true : false
    data.banner = !!(process.env.BANNER == 'true')
    res.status(200).json(data)
  })
  .catch( err => res.status(500).json({message: 'Something went wrong...'}))
})

app.get('/*', (req,res) => {
  const {err} = req
  console.log('Root: ',ENV)
  if(ENV==='production'){
    console.log('Running: ',ENV)
    res.sendFile(path.join(__dirname, '../client/build/index.html'))
  } else if(!err) {
    res.send('This is not a Web Page! Check your routes...')
  } else {
    res.send(err.message)
  }
})

let server = app.listen(PORT, () => {
  console.log('Server Running in: ',process.env.PORT)
})

// TRY HTTP2: no ssl-file
const options = {
  key: fs.readFileSync(__dirname + '/ssl/server.key'),
  cert:fs.readFileSync(__dirname + '/ssl/server.srt'),
}
//let server = spdy.createServer(options,app).listen(PORT, error => {
//  if(error){
//    console.log(error)
//    return process.exit(1)
//  } else {
//    console.log('H2 running on: ', PORT)
//  }
//})

// ==========================================================================

// # WebSocket-Node Server #
let wsServer = new WS({
  httpServer: server
})
let wsrouter = new WSR()
wsrouter.attachServer(wsServer)

wsrouter.mount('*','baker-protocol', request => {
// get WS.Connection
  let connection = request.accept(request.origin)
  const { id } = request.resourceURL.query
  connection.ID = Number(id)
  connection.on('message', msg => {
    const { user,fac,role } = JSON.parse(msg.utf8Data)
    console.log('Connected Bakers: ', bconn.length)
    // bconn.find( c => c.id===fac.id ).sendUTF(`Message from User: ${user}, recieved`)
    //connection.sendUTF(`Message from Baker: ${user}, recieved`)
  })
// Store baker-Connections:
  let baker = bconn.find( c => c.ID === Number(id) )
  if( !baker ) bconn.push(connection)
})

wsrouter.mount('*','customer-protocol', request => {
// get WS.Connection:
  let connection = request.accept(request.origin)
  const { id } = request.resourceURL.query
  connection.ID = Number(id)

  connection.on('message', msg => {
    const { user,fac,role } = JSON.parse(msg.utf8Data)
    let c = uconn.indexOf(connection)
    console.log(`Customers online: ${uconn.length}`)
    //bconn.forEach( c => {
    //  if(c.id===Number(fac)) {
        //uconn[0].conn.sendUTF(`Message from User: ${user}, recieved`)
    //  }
    //})
    //connection.sendUTF(`Message from User: ${user}, recieved`)

  })
  connection.on('close', (reasonCode, description) => {
    let c = uconn.indexOf(connection)
    connection.sendUTF('Connection closed!', uconn.length)
    uconn.splice(c,1)
  })
// Store customer-connections:
  let user = uconn.find( c => c.ID === Number(id) )
  if( !user ) uconn.push(connection)

})


// WebSocketServer Class:
//wsServer.on('request', request => {
//// request is webSocketRequest Object
//// .accept returns webSocketConnection Instance
//  let bakerCon = request.accept('baker-protocol', request.origin)
//
//})

wsServer.on('connect', socket => {
  console.log('Connection created at: ', new Date())
})

wsServer.on('close', (conn, reason, dsc) => {
  console.log('Connection closed at: ', conn.ID)
})
