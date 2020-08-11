'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _expressRequestLanguage = require('express-request-language');

var _expressRequestLanguage2 = _interopRequireDefault(_expressRequestLanguage);

var _api = require('../api/');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var productRouter = _express2.default.Router({
  mergeParams: true
});

productRouter.use(_bodyParser2.default.json());

productRouter.get('/:lan', function (req, res, next) {
  var lan = req.params.lan;
  // get only commercial products {type:1}:

  _api2.default.getList('product', ['*'], { type: 1 }).then(function (response) {
    var products = [];
    response.forEach(function (entry) {
      if (entry.c_status === 4) {
        var id = entry.id,
            promo = entry.promo,
            price = entry.price,
            price_pos = entry.price_pos,
            list = entry.list,
            category = entry.category,
            klass = entry.klass,
            prod_time = entry.prod_time;

        products.push(_extends({ name: JSON.parse(entry.name)[lan], dscr: JSON.parse(entry.descr)[lan] }, { id: id, promo: promo, price: price, list: list, category: category, klass: klass }));
      }
    });
    res.status(200).json(products);
  }).catch(function (err) {
    res.status(500).json({ messages: 'Wrong...' });
  });
});

exports.default = productRouter;
//# sourceMappingURL=product.js.map