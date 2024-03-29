'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _user = require('../api/user');

var _user2 = _interopRequireDefault(_user);

var _middleware = require('../middleware/');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
//import api from '../api/user'


var userRouter = (0, _express2.default)({
  mergeParams: true
});

userRouter.use(_bodyParser2.default.json());

// get user data: location, user
userRouter.get('/', _middleware.getUser, function (req, res, next) {
  var email = req.email;
  //let usr = {}

  console.log('userInit(): userRouter.get /user/', req.email);
  var scope = ['uid', 'username', 'userlast', 'verified', 'orders', 'credit', 'gender', 'bday', 'membership', 'language', 'status'];
  _user2.default.getOne({ email: email }, 'user', scope).then(function (response) {
    if (response.length === 0) return res.status(401).json({ error: { message: 'User Not Found' } });

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
    //let free_pizza = orders===0 || orders%5===0


    user = Object.assign({}, {
      uid: uid, username: username, userlast: userlast, verified: verified, orders: orders, credit: credit,
      gender: gender, bday: bday, membership: membership, language: language, status: status
    }); //,{free_pizza: free_pizza})

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
    return res.status(500).json({ error: { message: err } });
  });
});
// UPDATE FAC: state
userRouter.post('/fac/:id', function (req, res, next) {
  var data = req.body.data;

  data.id = Number(req.params.id);
  _user2.default.updateOne(data, 'fac').then(function () {
    res.status(200).json({});
  }).catch(function (err) {
    return res.status(500).json({ error: { message: err } });
  });
});

// GET FAC for users location
userRouter.post('/facs', _middleware.getLan, function (req, res, next) {
  var lan = req.lan;
  var id = req.body.id;

  _user2.default.getFac(id).then(function (results) {
    var facs = {};
    var _results$ = results[0],
        id = _results$.id,
        uid = _results$.uid,
        baker = _results$.baker,
        city = _results$.city,
        name = _results$.name,
        street = _results$.street,
        number = _results$.number,
        prime = _results$.prime,
        open = _results$.open,
        checkin = _results$.checkin,
        day_open = _results$.day_open,
        day_close = _results$.day_close,
        noon_open = _results$.noon_open,
        noon_close = _results$.noon_close,
        sat_open = _results$.sat_open,
        sat_close = _results$.sat_close,
        sun_open = _results$.sun_open,
        sun_close = _results$.sun_close,
        vacation_end = _results$.vacation_end,
        vacation_start = _results$.vacation_start,
        delivery = _results$.delivery,
        bottleneck = _results$.bottleneck,
        order_estimated = _results$.order_estimated,
        mobile = _results$.mobile;

    var st = JSON.parse(street)[lan];
    var products = results.map(function (entry) {
      var product = entry.product,
          list = entry.list,
          local_promo = entry.local_promo,
          local_price = entry.local_price,
          on_hand = entry.on_hand,
          take_only = entry.take_only,
          add_time = entry.add_time;

      return { product: product, list: list, local_promo: local_promo, local_price: local_price, on_hand: on_hand, take_only: take_only, add_time: add_time
        //if(open){
        //facs = { ...facs, [city]: facs[city]?
        //  {...facs[city],
        //    city, prime, open, fac, delivery, bottleneck, mobile,
        //    products: facs[city].products? [...facs[city].products, rest] : [rest]
        //  } :
        //  { city, prime, open, fac, products: [rest]} }
        //facs.push()
        //} else {
        //  facs = { ...facs, [location]: {open: 0}}
        //}
      };
    });
    facs = Object.assign({ id: id, uid: uid, baker: baker, city: city, name: name, number: number, prime: prime, open: open, checkin: checkin,
      day_open: day_open, day_close: day_close, noon_open: noon_open, noon_close: noon_close, sat_open: sat_open, sat_close: sat_close, sun_open: sun_open, sun_close: sun_close,
      vacation_end: vacation_end, vacation_start: vacation_start,
      delivery: delivery, bottleneck: bottleneck, order_estimated: order_estimated, mobile: mobile }, { products: products, street: st });
    res.status(200).json(facs);
  }).catch(function (err) {
    return console.log(err.message);
  });
});

// update users location: location details
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

// insert new user location
userRouter.post('/location', _middleware.getUser, function (req, res, next) {
  // or getUserId
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