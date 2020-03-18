'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _expressRequestLanguage = require('express-request-language');

var _expressRequestLanguage2 = _interopRequireDefault(_expressRequestLanguage);

var _middleware = require('../middleware/');

var _api = require('../api/');

var _api2 = _interopRequireDefault(_api);

var _uniqid = require('uniqid');

var _uniqid2 = _interopRequireDefault(_uniqid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var adminRouter = _express2.default.Router({
  mergeParams: true
});

adminRouter.use(_bodyParser2.default.json());

adminRouter.get('/location/ref/:uid', (0, _expressRequestLanguage2.default)({
  languages: ['en', 'es']
}), _middleware.getLan, function (req, res, next) {
  console.log('Get location in: ', req.lan);
  console.log('Get user location by: ', uid);
  var uid = req.params.uid;

  var data = void 0;
  _api2.default.getOneReference({ uid: uid }, 'location').then(function (response) {
    var _response$ = response[0],
        name = _response$.name,
        id = _response$.id,
        number = _response$.number;

    var street = JSON.parse(name)[req.lan];
    if (isNaN(uid)) {
      data = Object.assign({}, { number: number }, { id: id }, { street: street });
    } else {
      data = Object.assign({}, { number: number }, { street: street });
    }
    res.status(200).json(data);
  }).catch(function (err) {
    res.status(500).json({ messages: 'Wrong...' });
  });
});

adminRouter.get('/location/:type/:by', (0, _expressRequestLanguage2.default)({
  languages: ['en', 'es']
}), _middleware.getLan, function (req, res, next) {
  var scope = ['*'];
  var params = {},
      data = {},
      tp = '',
      prs = false,
      r = [];
  var _req$params = req.params,
      type = _req$params.type,
      by = _req$params.by;

  switch (req.params.type) {
    case 'street':
      params.city = Number(req.params.by);
      tp = 'streets';
      prs = true;
      break;
    case 'location':
      tp = 'locations';
      params.street_id = Number(req.params.by);
      break;
    default:
      params.city = Number(req.params.by);
  }

  _api2.default.getList(type, scope, params).then(function (response) {
    if (prs) {
      r = response.map(function (entry) {
        return { title: JSON.parse(entry.name)[req.lan], id: entry.id //req.language
        };
      });
    } else {
      r = response.map(function (entry) {
        // if location type is basic:
        if (entry.type === 32) {
          return { title: entry.number, id: entry.id };
        }
      });
    }
    data[tp] = r;
    res.status(200).json(data);
  }).catch(function (err) {
    return res.status(500).json({ messages: 'Something went wrong!' });
  });
});

adminRouter.get('/location', (0, _expressRequestLanguage2.default)({
  languages: ['en', 'es']
}), _middleware.getLan, function (req, res, next) {
  var data = {},
      params = {};
  //lan = req.language==='es'? 'es' : 'bg'
  if (req.lan) {
    var _lan = req.lan;
  } else {
    var _lan2 = req.language === 'es' ? 'es' : 'bg';
  }
  params.c_status = 4;
  _api2.default.getList('city', ['id', 'name'], params).then(function (response) {
    var cty = response.map(function (entry) {
      return { title: JSON.parse(entry.name)[lan], id: entry.id //req.language
      };
    });
    data.city = cty;
    res.status(200).json(data);
  });
});

// MAKE a LOCATION (a building): Street_ID, City_ID, Number
adminRouter.post('/location/:type', function (req, res, next) {
  var data = req.body.data;
  var type = req.params.type;

  var msgCap = type.charAt(0).toUpperCase() + type.slice(1);
  console.log(msgCap + ' Save: ', data, type);
  if (type === 'location') {
    data.uid = _uniqid2.default.time();
  }
  _api2.default.saveOneLocation(data, type).then(res.status(200).json({ message: msgCap + ' Saved!' })).catch(function (err) {
    return console.log('Error', err);
  });
});

//adminRouter.post('/locations/loc')

exports.default = adminRouter;

// SZ, HD, lat:42.430320, lng:25.622825
//# sourceMappingURL=admin.js.map