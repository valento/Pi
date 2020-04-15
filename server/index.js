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
import { getLan } from './middleware/'

dotenv.config({silent: true})
let app = express()
let PORT = process.env.PORT || 8080
let ENV = process.env.NODE_ENV || 'development'
let CURRENT_CITY = process.env.SINGLE_CITY > 0 ? process.env.SINGLE_CITY : 0

let WS = require('websocket').server

app.use('/static', express.static(path.join(__dirname, '../client/build/static')) )
app.use('/img', express.static(path.join(__dirname, '../client/build/img')) )
if(ENV === 'production') app.use(express.static(path.join(__dirname, '../client/build')) )

// == ROUTES ==============================================
app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/admin', adminRouter)
app.use('/products',productRouter)
app.use('/orders',orderRouter)

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

// # WebSocket-Node Server #
let wss = new WS({
  httpServer: server
})
// WebSocketServer Class:
wss.on('request', request => {
// request is webSocketRequest Object
// .accept returns webSocketConnection Instance
  let connection = request.accept('echo-protocol', request.origin)

  connection.on('message', message => {
    console.log('Socket: ',request.origin, message)
  })
})

wss.on('connect', socket => {
  console.log('Connection created at: ', new Date())
})
