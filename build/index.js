'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _spdy = require('spdy');

var _spdy2 = _interopRequireDefault(_spdy);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _expressRequestLanguage = require('express-request-language');

var _expressRequestLanguage2 = _interopRequireDefault(_expressRequestLanguage);

var _auth = require('./routes/auth');

var _auth2 = _interopRequireDefault(_auth);

var _user = require('./routes/user');

var _user2 = _interopRequireDefault(_user);

var _admin = require('./routes/admin');

var _admin2 = _interopRequireDefault(_admin);

var _product = require('./routes/product');

var _product2 = _interopRequireDefault(_product);

var _order = require('./routes/order');

var _order2 = _interopRequireDefault(_order);

var _api = require('./api/');

var _api2 = _interopRequireDefault(_api);

var _middleware = require('./middleware/');

var _events = require('events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config({ silent: true });
var app = (0, _express2.default)(),
    server = void 0;
var ENV = process.env.NODE_ENV || 'development';
var PORT = process.env.NODE_ENV === 'production' ? process.env.PORT || 8080 : 8080;
var CURRENT_CITY = process.env.SINGLE_CITY > 0 ? process.env.SINGLE_CITY : 0;

// Initiate WEB SOCKET:
var WS = require('websocket').server;
var WSR = require('websocket').router;

// Instantiate EVENT EMITTER:
var mediator = new _events.EventEmitter();
mediator.on('baker.login', function () {
  console.log('Baker Here!');
});

app.use('/static', _express2.default.static(_path2.default.join(__dirname, '../client/build/static')));
app.use('/img', _express2.default.static(_path2.default.join(__dirname, '../client/build/img')));
if (ENV === 'production') app.use(_express2.default.static(_path2.default.join(__dirname, '../client/build')));

// == ROUTES & ROUTERS =====================================
app.use('/auth', _auth2.default);
app.use('/user', _user2.default);
app.use('/admin', function (req, res, next) {
  req.mediator = mediator;
  next();
}, _admin2.default);
app.use('/products', _product2.default);
app.use('/orders', _order2.default);

// ========================================================

app.get('/ui', _middleware.getLan, function (req, res, next) {
  var data = {};
  var params = {
    c_status: 4
  };
  var lan = req.lan;
  // SWITCH to:    req.language// === 'en' ? 'bg' : req.language
  //if(lng === 'lan') {
  //  data.lan = req.language==='es'? 'es' : 'bg'
  //} else {

  data.lan = lan;
  if (!!CURRENT_CITY) data.city = Number(CURRENT_CITY);
  //}
  // get cities: ? add params {c_status: 4} if needed
  _api2.default.getList('city', ['name', 'id', 'zone', 'code', 'alt'], params).then(function (response) {
    //,{c_status: 4}
    var cty = response.map(function (entry) {
      //switch BG to req.language in production
      return {
        title: JSON.parse(entry.name)[data.lan],
        id: entry.id,
        //status: entry.c_status,
        alt: entry.alt ? JSON.parse(entry.alt)[data.lan] : NULL
      };
    });
    data.cities = cty;
    data.mob = req.get('user-agent').match(/(Mobile)/g) ? true : false;
    data.banner = !!(process.env.BANNER == 'true');
    res.status(200).json(data);
  }).catch(function (err) {
    return res.status(500).json({ message: 'Something went wrong...' });
  });
});

app.get('/*', function (req, res) {
  var err = req.err;

  console.log('Root: ', ENV);
  if (ENV === 'production') {
    console.log('Running: ', ENV);
    res.sendFile(_path2.default.join(__dirname, '../client/build/index.html'));
  } else if (!err) {
    res.send('This is not a Web Page! Check your routes...');
  } else {
    res.send(err.message);
  }
});

if (ENV === 'production') {
  // TRY HTTP2: no ssl-file
  var options = {
    key: _fs2.default.readFileSync(__dirname + '/ssl/server.key', 'utf8'),
    cert: _fs2.default.readFileSync(__dirname + '/ssl/server.srt', 'utf8')
  };
  server = _https2.default.createServer(options, app).listen(PORT, function (error) {
    if (error) {
      console.log(error);
      return process.exit(1);
    } else {
      console.log('HTTPS running on: ', PORT);
    }
  });
} else {
  server = app.listen(PORT, function () {
    return console.log('Server Running on: ', PORT);
  });
}

// ==========================================================================
// ==========================================================================
// # WebSocket-Node Server #
// ==========================================================================

// WS Connection Objects List: user,ref,dlv,pos,baker,fac,lab,root
var uconn = [],
    rconn = [],
    dconn = [],
    pconn = [],
    bconn = [],
    fconn = [],
    lconn = [],
    rootconn = [];
// WS protocols:
var roles = ['root', 'lab', 'fac', 'baker', 'pos', 'dlv', 'test', 'rep', 'customer'];
var wsServer = new WS({
  httpServer: server,
  autoAcceptConnections: false
});
var wsrouter = new WSR();
wsrouter.attachServer(wsServer);

// BAKER: =====================================================================
wsrouter.mount('*', 'baker-protocol', function (request) {
  request.on('requestAccepted', function (connection) {
    connection.sendUTF('WS: Baker is listening!');
  });
  // get WS.Connection
  var connection = request.accept(request.origin);
  var id = request.resourceURL.query.id;

  connection.ID = Number(id);

  // Event handlers:
  connection.on('message', function (msg) {
    var _JSON$parse = JSON.parse(msg.utf8Data),
        user = _JSON$parse.user,
        fac = _JSON$parse.fac,
        role = _JSON$parse.role;

    console.log('Connected Bakers: ', bconn.length);
    // bconn.find( c => c.id===fac.id ).sendUTF(`Message from User: ${user}, recieved`)
    //connection.sendUTF(`Message from Baker: ${user}, recieved`)
  });
  // Store baker-Connections:
  var baker = bconn.find(function (c) {
    return c.ID === Number(id);
  });
  if (!baker) bconn.push(connection);
});

// CUSTOMER: ==================================================================
wsrouter.mount('*', 'customer-protocol', function (request) {
  request.on('requestAccepted', function (connection) {
    connection.sendUTF('WS: Customer accepted!');
  });
  // get WS.Connection:
  var connection = request.accept(request.origin);
  var id = request.resourceURL.query.id;

  connection.ID = Number(id);

  // Event handlers:
  connection.on('message', function (msg) {
    var _JSON$parse2 = JSON.parse(msg.utf8Data),
        user = _JSON$parse2.user,
        fac = _JSON$parse2.fac,
        role = _JSON$parse2.role,
        order = _JSON$parse2.order;

    console.log('Message from customer:', connection.ID);
    if (order) {
      // ping 'baker-protocol'
      var bkr = bconn.find(function (c) {
        return c.ID === fac;
      });
      if (bkr) bkr.sendUTF('Order from ' + user + ' to ' + fac);
    }
    uconn.forEach(function (c) {
      c.sendUTF('One more Customer: ' + user + ', recieved');
    });
    //connection.sendUTF(`${uconn.length - 1} Messages from User: ${user}, send`)
  });

  connection.on('close', function (reasonCode, description) {
    var c = uconn.indexOf(connection);
    connection.sendUTF('WS: Customer connection closed!', uconn[c].ID);
    uconn.splice(c, 1);
  });

  // Store unique customer-connections:
  var user = uconn.find(function (c) {
    return c.ID === Number(id);
  });
  if (!user) uconn.push(connection);
});

// TESTER: =====================================================================
wsrouter.mount('*', 'test-protocol', function (request) {
  request.on('requestAccepted', function (connection) {
    connection.sendUTF('WS: Tester is listening!');
  });
  // get WS.Connection
  var connection = request.accept(request.origin);
  var id = request.resourceURL.query.id;

  // Event handlers:

  connection.ID = Number(id);
  connection.on('message', function (msg) {
    var _JSON$parse3 = JSON.parse(msg.utf8Data),
        user = _JSON$parse3.user,
        fac = _JSON$parse3.fac,
        role = _JSON$parse3.role;

    console.log('WS: Connected Testers: ', tconn.length);
    // bconn.find( c => c.id===fac.id ).sendUTF(`Message from User: ${user}, recieved`)
    //connection.sendUTF(`Message from Baker: ${user}, recieved`)
  });
  // Store baker-Connections:
  var tester = tconn.find(function (c) {
    return c.ID === Number(id);
  });
  if (!tester) tconn.push(connection);
});
// ======================================================================


// WebSocketServer Class:
//wsServer.on('request', request => {
//// request is webSocketRequest Object
//// .accept returns webSocketConnection Instance
//  let bakerCon = request.accept('baker-protocol', request.origin)
//
//})

wsServer.on('connect', function (socket) {
  console.log('Connection created at: ', new Date());
});

wsServer.on('close', function (conn, reason, dsc) {
  console.log('Connection closed at: ', conn.ID);
});
//# sourceMappingURL=index.js.map