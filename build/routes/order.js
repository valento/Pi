'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _middleware = require('../middleware/');

var _api = require('../api/');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var orderRouter = _express2.default.Router({
  mergeParams: true
});

orderRouter.use(_bodyParser2.default.json());

// Save an Order and Order_Details
orderRouter.post('/', _middleware.getUserId, _middleware.getLan, function (req, res, next) {
  var ui = {
    en: ['We recieved your order:'],
    es: ['Recibido su pedido:'],
    bg: ['Поръчката Ви е получена:']
  };
  var uid = req.uid,
      member = req.member,
      lan = req.lan;

  var order = void 0;
  // If Tester, don't INSERT in DB
  if (member === 64) return res.status(200).json({ message: 'Order recieved' });

  // Prepare SQL Data Object:
  var _req$body$data = req.body.data,
      user_location = _req$body$data.user_location,
      delivery = _req$body$data.delivery,
      fac_id = _req$body$data.fac_id,
      total = _req$body$data.total,
      cart = _req$body$data.cart;
  //console.log(uid, req.body.data)
  // Save ORDER & RETURN Success Status

  _api2.default.saveOne(Object.assign({}, { uid: uid }, { user_location: user_location, delivery: delivery, total: total, fac_id: fac_id }), 'orders').then(function (id) {
    order = id;
    var details = cart.map(function (o) {
      return { order_id: id, item: o.product, quant: o.quant, promo_id: o.promo ? o.promo : null };
    });
    _api2.default.saveMany(details, 'order_detail');
  }).then(function () {
    return _api2.default.updateOne({ id: uid, orders: 'orders+1' }, 'user');
  }).then(function () {
    //req.mediator.emit('new.incoming.order')
    res.status(200).json({ message: ui[lan][0] + ' #' + order });
  }).catch(function (err) {
    return res.status(500).json({ message: err });
  });
});

orderRouter.get('/:fac', function (req, res, next) {
  // Get Pending Orders:
});

exports.default = orderRouter;
//# sourceMappingURL=order.js.map