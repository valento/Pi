// let WebSocketClient = require('websocket').w3cwebsocket
import api from './api'

var userSocket,
// ------------ 1 --- 2 ---- 4 ---- 8 --- 16 -- 32 -- 64 --- 128 --- 256
    roles = ['root','lab','fac','baker','pos','dlv','test','rep','customer']
// Check User Role:
const getID = (member,id,fac,lab) => {
  switch (member) {
    case 2 : return lab
    case 4 : return fac
    case 8 : return fac
    case 64 : return fac
    default : return id
  }
}
const getRole = member => {
  let adm = member ? (member).toString(2).split('').reverse() : 0
  console.log('memberships: ',adm)
  let _roles=[], r
  _roles = roles.filter( (m,i) => Number(adm[i]) === 1 )
  if(_roles.length === 0) return 'home'
  return r = _roles.length > 1 ? _roles[_roles.length - 1] : _roles[0]
}


export const initSocket = (id,membership,fac) => {
  let ID = getID(membership,id,fac,null)
  let role = getRole(membership)
  if(role === 'rep') role = 'customer'

  let URL = process.env.NODE_ENV==='production'?
  `wss://pizzapi.co/?id=${ID}` :
  `ws://localhost:8080/?id=${ID}`

  console.log('Role/ID: ', role, ID)
  console.log('WS on: ', URL)

  userSocket = new WebSocket(URL,`${role}-protocol`)
// listening for any userSocket error
  userSocket.onerror = error => console.log('WebSocket error: ' + error)

  userSocket.onopen = () => console.log(`${role}-Socket on Client`)

// api.settup.userSocket.member = membership
}

export const subscribeSocket = cb => {
console.log('Socket Subscribed')
  userSocket.onmessage = message => {
    console.log(message.data)
    if(!cb) return console.log(message.data)
// console.log(message.data)
    cb(message.data)
  }
}

export const fireSocket = (action,payload) => {
// todo: check action type
  userSocket.send(payload)
}

export const closeSocket = id => {
  //api.settup.setupFac({ data: {open: false}, id:id })
  userSocket.close()
}
