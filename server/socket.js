// Initiate WEB SOCKET:
  var WS = require('websocket').server
  var WSR = require('websocket').router

// WS Connection Objects List: user,ref,dlv,pos,baker,fac,lab,root
  let conn = { root: [], lab: [], fac: [], baker: [], pos: [], dlv: [],
    test: [], rep: [], customer: [] }
// WS protocols:
  var roles = ['root','lab','fac','baker','pos','dlv','test','rep','customer']



const open = (server,member) => {
  let rnd = Math.floor(Math.random()*Math.floor(6))
console.log('Initial Users: ',rnd)
  const wsServer = new WS({
    httpServer: server,
    autoAcceptConnections: false
  })

  const wsrouter = new WSR()
  wsrouter.attachServer(wsServer)

  roles.forEach( (role,index) => {
    wsrouter.mount('*',`${role}-protocol`, request => {

      request.on('requestAccepted', connection => {
        if(connection.protocol === 'customer-protocol') {
          if(conn.customer.length > 0) {
             conn.customer.forEach( c => c.send(JSON.stringify({customer_counter: conn.customer.length+rnd})))
          }
        } else if (connection.protocol === 'baker-protocol'){
          if(conn[role].length>0) {
            conn.baker.forEach( b => b.send(JSON.stringify({customer_counter: conn.customer.length})))
          }

        }
      })
  // get WS.Connection
      let connection = request.accept(request.origin)
      const { id } = request.resourceURL.query
      connection.ID = Number(id)
  // Store baker-Connections:
      let con = conn[role].find( c => c.ID === Number(id) )
      if( !con ) conn[role].push(connection)

  // Event handlers:
  // ------ MESSAGING Event: ------------------------------------
      connection.on('message', msg => {
        const { user,fac,mem,ordered } = JSON.parse(msg.utf8Data)
        console.log('Socket Parse: ', user,fac,mem,ordered)
        let bkr = conn.baker.find( c => c.ID === fac )
        let order = !!ordered
        if(bkr) {
          console.log(`Baker ${bkr.ID}, send`)
          bkr.send(JSON.stringify({ user: id, order: order }))
        }
          //conn[roles[Math.log2(mem)]].find( c => c.ID===user ).sendUTF(`Message from User: ${user}, recieved`)
        console.log(`Connected ${role}: ${user} `)

      //connection.sendUTF(`Message from Baker: ${user}, recieved`)
      })
  // ------ CLOSE Event: ------------------------------------
      connection.on('close', (reasonCode, description) => {
        let i = conn[role].find(c => c.ID === connection.ID)
        conn[role].splice(i,1)
        if(role === 'customer' && conn.customer.length>0) {
          conn.customer.forEach( c => {
            c.send(JSON.stringify({customer_counter: conn[role].length+rnd}))
          })
        }
      })

    })
  })

  wsServer.on('connect', socket => {
    console.log('Connection created at: ', new Date())
  })

  wsServer.on('close', (conn, reason, dsc) => {
    console.log('Connection closed at: ', conn.ID)
  })

// BAKER: =====================================================================


//// CUSTOMER: ==================================================================
//  wsrouter.mount('*','customer-protocol', request => {
//    request.on('requestAccepted', connection => {
//      connection.sendUTF('WS: Customer accepted!')
//    })
//// get WS.Connection:
//    let connection = request.accept(request.origin)
//    const { id } = request.resourceURL.query
//    connection.ID = Number(id)
//
//// Event handlers:
//// ------ MESSAGING Event: ----------------------
//    connection.on('message', msg => {
//      const { user,fac,role,order } = JSON.parse(msg.utf8Data)
//      console.log('Message from customer:', connection.ID)
//      if(order) {
//      // ping 'baker-protocol'
//        let bkr = bconn.find( c => c.ID === fac )
//        if(bkr) bkr.send(JSON.stringify({ user: id, order: true }))
//      }
//      uconn.forEach( c => {
//        c.sendUTF(`One more Customer: ${user}, recieved`)
//      })
//      //connection.sendUTF(`${uconn.length - 1} Messages from User: ${user}, send`)
//
//    })
//// ------ CLOSE Event: ------------------------------------
//    connection.on('close', (reasonCode, description) => {
//      let c = uconn.indexOf(connection)
//      //if(uconn[c].ID) connection.sendUTF('WS: Customer connection closed!', uconn[c].ID)
//      uconn.splice(c,1)
//      console.log('Consumer Sockets: ',uconn.length)
//    })
//
//// Store unique customer-connections:
//    let user = uconn.find( c => c.ID === Number(id) )
//    if( !user ) uconn.push(connection)
//
//  })
//
//// TESTER: =====================================================================
//    wsrouter.mount('*','test-protocol', request => {
//      request.on('requestAccepted', connection => {
//        connection.sendUTF('WS: Tester is listening!')
//      })
//  // get WS.Connection
//      let connection = request.accept(request.origin)
//      const { id } = request.resourceURL.query
//
//  // Event handlers:
//      connection.ID = Number(id)
//      connection.on('message', msg => {
//        const { user,fac,role } = JSON.parse(msg.utf8Data)
//        console.log('WS: Connected Testers: ', tconn.length)
//      // bconn.find( c => c.id===fac.id ).sendUTF(`Message from User: ${user}, recieved`)
//        //connection.sendUTF(`Message from Baker: ${user}, recieved`)
//      })
//  // Store baker-Connections:
//      let tester = tconn.find( c => c.ID === Number(id) )
//      if( !tester ) tconn.push(connection)
//    })
//// ======================================================================
//
//  // WebSocketServer Class:
//  //wsServer.on('request', request => {
//  //// request is webSocketRequest Object
//  //// .accept returns webSocketConnection Instance
//  //  let bakerCon = request.accept('baker-protocol', request.origin)
//  //
//  //})
//


}

export default Object.assign({},{ open })
