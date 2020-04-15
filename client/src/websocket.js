//let WebSocketClient = require('websocket').w3cwebsocket
let URL = process.env.NODE_ENV==='production'?
'wss://sapient-tracer-232311.appspot.com/' :
'ws://localhost:8080'
const socket = new WebSocket('ws://localhost:8080','echo-protocol')
// listening for any socket error
socket.onerror = function (error) {
console.log('WebSocket error: ' + error)
}

export const subscribeSocket = cb => {
  socket.on('open', )
}

export const fireSocket = (action,payload) => {
  console.log('Socket send a new message!')
  socket.send(payload.message)
}
