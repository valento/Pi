//let WebSocketClient = require('websocket').w3cwebsocket

let socket = new WebSocket('ws://localhost:8080')

socket.onopen = event => {
  console.log(event)
}

export default socket
