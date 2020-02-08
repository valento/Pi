'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkAdmin = exports.getUserId = exports.getLan = exports.getUser = undefined;

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getUser = exports.getUser = function getUser(req, res, next) {
  var token = req.get('Authorization');
  try {
    var decoded = _jsonwebtoken2.default.decode(token);
    console.log('/user API-decoded: ', decoded);
    req.email = decoded.email;
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  next();
};

var getLan = exports.getLan = function getLan(req, res, next) {
  var lan = req.get('Accepted-Language');
  req.lan = lan;
  console.log('Accepted-Language: ', lan);
  next();
};

var getUserId = exports.getUserId = function getUserId(req, res, next) {
  var token = req.get('Authorization');
  try {
    var decoded = _jsonwebtoken2.default.decode(token);
    console.log('/user API-decoded: ', decoded);
    req.uid = decoded.uid;
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  next();
};

var checkAdmin = exports.checkAdmin = function checkAdmin(req, res, next) {
  var token = req.get('Authorization');
  _jsonwebtoken2.default.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (!err && decoded.email === 'valentin.mundrov@gmail.com') {
      req.id = decoded.uid;
      next();
    } else {
      return res.status(401).json({ message: 'Unauthorized User!' });
    }
  });
};
//# sourceMappingURL=index.js.map