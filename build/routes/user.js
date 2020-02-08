'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _user = require('../api/user');

var _user2 = _interopRequireDefault(_user);

var _middleware = require('../middleware/');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
//import api from '../api/user'


var userRouter = (0, _express2.default)({
  mergeParams: true
});

userRouter.use(_bodyParser2.default.json());

userRouter.get('/', _middleware.getUser, function (req, res, next) {
  console.log('userInit(): userRouter.get /user/', req.email);
  var email = req.email;

  var scope = ['uid', 'username', 'userlast', 'verified', 'orders', 'credit', 'gender', 'bday', 'membership', 'language', 'status'];
  _user2.default.getOne({ email: email }, 'user', scope).then(function (response) {
    var user = {};

    var _response$ = response[0],
        uid = _response$.uid,
        username = _response$.username,
        userlast = _response$.userlast,
        verified = _response$.verified,
        orders = _response$.orders,
        credit = _response$.credit,
        gender = _response$.gender,
        bday = _response$.bday,
        membership = _response$.membership,
        language = _response$.language,
        status = _response$.status,
        rest = _objectWithoutProperties(_response$, ['uid', 'username', 'userlast', 'verified', 'orders', 'credit', 'gender', 'bday', 'membership', 'language', 'status']);

    user = Object.assign({}, { uid: uid, username: username, userlast: userlast, verified: verified, orders: orders, credit: credit, gender: gender, bday: bday, membership: membership, language: language, status: status });
    if (response.length > 1) {
      user.locations = [];
      response.forEach(function (ent) {
        var mobile = ent.mobile,
            name = ent.name,
            location = ent.location,
            city = ent.city,
            admin = ent.admin,
            door = ent.door,
            floor = ent.floor,
            bell = ent.bell,
            id = ent.id,
            entry = ent.entry,
            prime = ent.prime,
            c_status = ent.c_status;

        if (c_status === 4) {
          user.locations.push({ mobile: mobile, name: name, location: location, city: city, admin: admin, door: door, floor: floor, bell: bell, id: id, entry: entry, prime: prime });
        }
      });
    } else {
      if (rest.id !== null) {
        user.locations = [];
        user.locations.push(rest);
      }
    }
    //console.log(user)
    res.status(200).json({ user: user });
  }).catch(function (err) {
    return res.status(500).json({ errors: { message: err } });
  });
});

// GET ALL FACs for All user.locations
userRouter.post('/facs', function (req, res, next) {
  var ids = req.body.ids;

  _user2.default.getAllFac(ids).then(function (results) {
    var facs = [];
    results.forEach(function (entry) {
      var fac = entry.fac,
          city = entry.city,
          prime = entry.prime,
          open = entry.open,
          delivery = entry.delivery,
          bottleneck = entry.bottleneck,
          mobile = entry.mobile,
          rest = _objectWithoutProperties(entry, ['fac', 'city', 'prime', 'open', 'delivery', 'bottleneck', 'mobile']);
      //if(open){


      facs = _extends({}, facs, _defineProperty({}, city, facs[city] ? _extends({}, facs[city], {
        city: city, prime: prime, open: open, fac: fac, delivery: delivery, bottleneck: bottleneck, mobile: mobile,
        products: facs[city].products ? [].concat(_toConsumableArray(facs[city].products), [rest]) : [rest]
      }) : { city: city, prime: prime, open: open, fac: fac, products: [rest] }));

      //facs.push()
      //} else {
      //  facs = { ...facs, [location]: {open: 0}}
      //}
    });
    res.status(200).json(facs);
  }).catch(function (err) {
    return console.log(err.message);
  });
});

userRouter.post('/location/:id', function (req, res, next) {
  var data = req.body.data;

  console.log('User Router: ', data);
  data.id = Number(req.params.id);
  _user2.default.updateOne(data, 'user_location').then(function () {
    return res.status(200).json({ message: 'Location saved!' });
  }).catch(function (err) {
    return res.status(500).json({ errors: { message: 'Something went wrong' } });
  });
});

userRouter.post('/location', _middleware.getUserId, function (req, res, next) {
  var data = req.body.data;

  data.uid = req.uid;
  _user2.default.saveOne(data, 'user_location').then(function (id) {
    return res.status(200).json({ id: id });
  }).catch(function (err) {
    return res.status(500).json({ errors: { message: 'Something went wrong' } });
  });
});

exports.default = userRouter;
//# sourceMappingURL=user.js.map