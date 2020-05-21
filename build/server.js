'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

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

var start = function start(options) {
  var ENV = options.ENV,
      PORT = options.PORT,
      CURRENT_CITY = options.CURRENT_CITY;


  return new Promise(function (resolve, reject) {
    var app = (0, _express2.default)();

    app.use('/static', _express2.default.static(_path2.default.join(__dirname, '../client/build/static')));
    app.use('/img', _express2.default.static(_path2.default.join(__dirname, '../client/build/img')));
    if (ENV === 'production') app.use(_express2.default.static(_path2.default.join(__dirname, '../client/build')));

    // == ROUTES & ROUTERS =====================================
    app.use('/auth', _auth2.default);
    app.use('/user', _user2.default);
    app.use('/admin', function (req, res, next) {
      //req.mediator = mediator
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
      _api2.default.getList('city', ['name', 'status', 'id', 'zone', 'code', 'alt'], params).then(function (response) {
        //,{c_status: 4}
        var cty = response.map(function (entry) {
          //switch BG to req.language in production
          return {
            title: JSON.parse(entry.name)[data.lan],
            id: entry.id,
            //status: entry.c_status,
            alt: entry.alt ? JSON.parse(entry.alt)[data.lan] : NULL,
            status: entry.status
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
      console.log('Server Running on: ', PORT);
      //resolve(app)
    });
    resolve(server);
  });
};

exports.default = Object.assign({}, { start: start });
//# sourceMappingURL=server.js.map