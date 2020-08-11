'use strict';

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _socket = require('./socket');

var _socket2 = _interopRequireDefault(_socket);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _spdy = require('spdy');

var _spdy2 = _interopRequireDefault(_spdy);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _events = require('events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config({ silent: true });
var __options = {};
// Initiate WEB SOCKET:
var WS = require('websocket').server;
var WSR = require('websocket').router;
//let app = express(), server
__options.ENV = process.env.NODE_ENV || 'development';
__options.PORT = process.env.NODE_ENV === 'production' ? process.env.PORT || 8080 : 8080;
__options.CURENT_CITY = process.env.SINGLE_CITY > 0 ? process.env.SINGLE_CITY : 0;

_server2.default.start(__options).then(function (server) {
  // # WebSocket-Node Server #
  _socket2.default.open(server);
}).catch(function (err) {
  return console.log(err);
});

// Instantiate EVENT EMITTER:
var mediator = new _events.EventEmitter();
mediator.on('baker.login', function () {
  console.log('Baker Here!');
});

var options = {
  key: _fs2.default.readFileSync(__dirname + '/ssl/server.key', 'utf8'),
  cert: _fs2.default.readFileSync(__dirname + '/ssl/server.srt', 'utf8')

  //if(ENV==='production') {
  //// TRY HTTP2: no ssl-file
  //  const options = {
  //    key: fs.readFileSync(__dirname + '/ssl/server.key', 'utf8'),
  //    cert:fs.readFileSync(__dirname + '/ssl/server.srt', 'utf8')
  //  }
  //  server = https.createServer(options,app).listen(PORT, error => {
  //    if(error){
  //      console.log(error)
  //      return process.exit(1)
  //    } else {
  //      console.log('HTTPS running on: ', PORT)
  //    }
  //  })
  //} else {
  // server = app.listen(PORT, () => console.log('Server Running on: ',PORT) )
  //}

};
//# sourceMappingURL=index.js.map