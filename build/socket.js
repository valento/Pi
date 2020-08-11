'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Initiate WEB SOCKET:
var WS = require('websocket').server;
var WSR = require('websocket').router;

// WS Connection Objects List: user,ref,dlv,pos,baker,fac,lab,root
var conn = { root: [], lab: [], fac: [], baker: [], pos: [], dlv: [],
  test: [], rep: [], customer: []
  // WS protocols:
};var roles = ['root', 'lab', 'fac', 'baker', 'pos', 'dlv', 'test', 'rep', 'customer'];

var open = function open(server, member) {
  var rnd = Math.floor(Math.random() * Math.floor(6));
  var wsServer = new WS({
    httpServer: server,
    keepalive: true
  });

  var wsrouter = new WSR();
  wsrouter.attachServer(wsServer);

  roles.forEach(function (role, index) {
    wsrouter.mount('*', role + '-protocol', function (request) {
      // Count Inital User array on Hand-shake:
      request.on('requestAccepted', function (connection) {
        if (connection.protocol === 'customer-protocol') {
          if (conn.customer.length > 0) {
            conn.customer.forEach(function (c) {
              return c.send(JSON.stringify({
                customer_counter: conn.customer.length + rnd
              }));
            });
          }
          if (conn.baker.length > 0) {
            conn.baker.forEach(function (b) {
              return b.send(JSON.stringify({
                customer_counter: conn.customer.map(function (cst) {
                  return cst.FAC;
                })
              }));
            });
          }
        } else if (connection.protocol === 'baker-protocol') {
          connection.send(JSON.stringify({
            customer_counter: conn.customer.map(function (cst) {
              return cst.FAC;
            })
          }));
        }
      });
      // get WS.Connection
      var connection = request.accept(request.origin);
      var _request$resourceURL$ = request.resourceURL.query,
          id = _request$resourceURL$.id,
          fac = _request$resourceURL$.fac;

      connection.ID = Number(id);
      connection.FAC = Number(fac);
      // Store baker-Connections:
      var con = conn[role].find(function (c) {
        return c.ID === Number(id);
      });
      if (!con) conn[role].push(connection);

      // Event handlers:
      // ------ MESSAGING Event: ------------------------------------
      connection.on('message', function (msg) {
        var _JSON$parse = JSON.parse(msg.utf8Data),
            user = _JSON$parse.user,
            fac = _JSON$parse.fac,
            mem = _JSON$parse.mem,
            ordered = _JSON$parse.ordered,
            open = _JSON$parse.open;

        console.log('Socket Parse: ', user, fac, mem, ordered);
        var bkr = conn.baker.find(function (c) {
          return c.ID === fac;
        });
        var order = !!ordered;
        if (bkr && order) {
          bkr.send(JSON.stringify({ user: id, order: order }));
        } else if (open !== undefined) {
          conn.customer.filter(function (c) {
            return c.FAC === fac;
          }).forEach(function (c) {
            return c.send(JSON.stringify({ fac: fac, open: open }));
          });
        }
        //conn[roles[Math.log2(mem)]].find( c => c.ID===user ).sendUTF(`Message from User: ${user}, recieved`)

        //connection.sendUTF(`Message from Baker: ${user}, recieved`)
      });
      // ------ CLOSE Event: ------------------------------------
      connection.on('close', function (reasonCode, description) {
        console.log('Close Customer Connection: ', connection.ID, connection.FAC);
        var FAC = connection.FAC,
            ID = connection.ID,
            local_customers = [],
            all_customers = void 0;

        var b = conn.baker.find(function (b) {
          return b.FAC === FAC;
        });
        var i = conn[role].findIndex(function (c) {
          return c.ID === ID;
        });
        conn[role].splice(i, 1);

        if (role === 'customer') {
          // Notify Baker counter:
          if (b) {
            local_customers = conn.customer.filter(function (cst) {
              return cst.FAC === FAC;
            });
            //console.log('Local Customers: ', local_customers)
            b.send(JSON.stringify({ customer_counter: local_customers.map(function (c) {
                return c.FAC;
              }) }));
          }
          // Notify Customer counter:
          conn.customer.forEach(function (c) {
            return c.send(JSON.stringify({
              customer_counter: conn.customer.length
            }));
          });
        }
      });
    });
  });

  wsServer.on('connect', function (c) {
    console.log('Connection created at: ', new Date());
  });

  wsServer.on('close', function (conn, reason, dsc) {
    console.log('Connection closed at: ', conn.ID);
  });

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

};

exports.default = Object.assign({}, { open: open });
//# sourceMappingURL=socket.js.map