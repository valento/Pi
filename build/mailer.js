'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendConfirmMail = undefined;

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _nodemailerSmtpTransport = require('nodemailer-smtp-transport');

var _nodemailerSmtpTransport2 = _interopRequireDefault(_nodemailerSmtpTransport);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config({ silent: true });

var HOST = void 0;

if (process.env.NODE_ENV === 'production') {
  HOST = process.env.HOST;
} else {
  HOST = 'http://localhost:8080';
}

var from = '\'PiLab\' <noreply@lightcharm.co>';

var setup = function setup() {
  return _nodemailer2.default.createTransport(
  //smtp(
  {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.MAILJET_API_KEY,
      pass: process.env.MAILJET_API_SECRET
    }
    //)
  });
};

var sendConfirmMail = exports.sendConfirmMail = function sendConfirmMail(email, token) {
  var transport = setup();
  var mail = {
    from: from,
    to: email,
    subject: 'Wellcome to Pi-Lab: the best pizza in town',
    text: 'Wellcome Pi,\n\nplease click the link to confirm your email...\n    \n\n\n      ' + HOST + '/auth/confirmation/' + token + '\n    '
  };
  console.log(HOST + '/confirmation/' + token);
  transport.sendMail(mail, function (err, json) {
    if (err) {
      return console.log(err);
    }
    console.log(json);
  });
};

/* =============================================== */
//# sourceMappingURL=mailer.js.map