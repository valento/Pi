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

orderRouter.post('/', _middleware.getUserId, function (req, res, next) {
  var uid = req.uid;

  console.log(uid);
  console.log(req.body);
  res.status(200).json({ message: 'Order recieved' });
});

exports.default = orderRouter;
//# sourceMappingURL=order.js.map