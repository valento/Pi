import { client } from 'websocket'

const socket = new client()

socket.on('connect', error => {
  console.log('Connection Error: ',error.toString())
})

export default socket
