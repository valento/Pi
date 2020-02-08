'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _generatePassword = require('generate-password');

var _generatePassword2 = _interopRequireDefault(_generatePassword);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _user = require('../api/user');

var _user2 = _interopRequireDefault(_user);

var _mailer = require('../mailer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var authRouter = _express2.default.Router({
  mergeParams: true
});

authRouter.use(_bodyParser2.default.json());

authRouter.post('/', function (req, res, next) {
  var new_user = true,
      user = void 0,
      token = void 0,
      confirmToken = void 0,
      pass = void 0;
  var email = req.body.credentials.email;

  var jwtOptions = {
    expiresIn: '240d'
  };
  var scope = ['username', 'userlast', 'uid', 'verified', 'credit', 'gender', 'bday', 'membership', 'language', 'status'];
  _user2.default.checkOne(email, scope).then(function (results) {
    // User exist:
    if (results.length > 0) {
      var uid = results[0].uid;

      token = _jsonwebtoken2.default.sign({ email: email, uid: uid }, process.env.JWT_SECRET, jwtOptions);
      user = Object.assign({}, { token: token, new_user: false }, results[0]);
      res.status(200).json({ user: user });
    } else {
      // User is new:
      confirmToken = _jsonwebtoken2.default.sign({ email: email }, process.env.JWT_SECRET, jwtOptions);
      pass = _generatePassword2.default.generate({
        length: 8,
        numbers: true
      });
      // encrypt password and save it to DB:
      _bcrypt2.default.hash(pass, 8, function (err, hash) {
        if (!err) {
          _user2.default.signup({ email: email, password: hash, token: confirmToken }).then(function (id) {
            // Send mail to User with confirmToken:
            (0, _mailer.sendConfirmMail)(email, confirmToken);
            console.log('authRouter:', id);
            // Generate Token for localStorage:
            token = _jsonwebtoken2.default.sign({ email: email, uid: id }, process.env.JWT_SECRET, jwtOptions);
            user = Object.assign({}, { token: token, new_user: true });
            res.status(200).json({ user: user });
          }).catch(function (err) {
            res.status(500).json(err);
          });
        }
      });
    }
  }).catch(function (err) {
    return console.log(err);
  });
});

authRouter.get('/confirmation/:token', function (req, res, next) {
  var token = req.params.token;

  var decoded = _jsonwebtoken2.default.decode(token);
  if (!decoded || decoded === null) {
    console.log('Invalid verification token...');
    req.errr = { message: 'Invalid verification token...'
      //next()
    };res.redirect('/');
  } else {
    _user2.default.verify(decoded.email, ['email']).then(function (rows) {
      if (rows === 0) {
        req.errr = { message: 'No such user' };
      }
      //next()
      res.redirect('/');
    }).catch(function (err) {
      return { message: 'Something went wrong' };
    });
  }
});

exports.default = authRouter;
//# sourceMappingURL=auth.js.map