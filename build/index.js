'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config({ silent: true });
var app = (0, _express2.default)();
var PORT = process.env.PORT || 8080;
var ENV = process.env.NODE_ENV || 'development';
var CURRENT_CITY = process.env.SINGLE_CITY > 0 ? process.env.SINGLE_CITY : 0;

var WS = require('websocket').server;

app.use('/static', _express2.default.static(_path2.default.join(__dirname, '../client/build/static')));
app.use('/img', _express2.default.static(_path2.default.join(__dirname, '../client/build/img')));
if (ENV === 'production') app.use(_express2.default.static(_path2.default.join(__dirname, '../client/build')));

// == ROUTES ==============================================
app.use('/auth', _auth2.default);
app.use('/user', _user2.default);
app.use('/admin', _admin2.default);
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

var server = app.listen(PORT, function () {
  console.log('Server Running in: ', process.env.PORT);
});

// TRY HTTP2: no ssl-file
var options = {
  key: _fs2.default.readFileSync(__dirname + '/ssl/server.key'),
  cert: _fs2.default.readFileSync(__dirname + '/ssl/server.srt')
  //let server = spdy.createServer(options,app).listen(PORT, error => {
  //  if(error){
  //    console.log(error)
  //    return process.exit(1)
  //  } else {
  //    console.log('H2 running on: ', PORT)
  //  }
  //})

  // # WebSocket-Node Server #
};var wss = new WS({
  httpServer: server
});
// WebSocketServer Class:
wss.on('request', function (request) {
  // request is webSocketRequest Object
  // .accept returns webSocketConnection Instance
  var connection = request.accept('echo-protocol', request.origin);

  connection.on('message', function (message) {
    console.log('Socket: ', request.origin, message);
  });
});

wss.on('connect', function (socket) {
  console.log('Connection created at: ', new Date());
});
//# sourceMappingURL=index.js.map