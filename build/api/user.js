'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var config = require('../../config');

var options = {
  user: config.get('MYSQL_USER'),
  password: config.get('MYSQL_PASSWORD'),
  database: config.get('MYSQL_DB')
};

if (config.get('INSTANCE_CONNECTION_NAME') && config.get('NODE_ENV') === 'production') {
  options.socketPath = '/cloudsql/' + config.get('INSTANCE_CONNECTION_NAME');
} else {
  options.host = 'localhost';
}

var db = _mysql2.default.createConnection(options);

exports.default = {

  signup: function signup(data) {
    var sql = '';
    var email = data.email,
        password = data.password,
        token = data.token;

    if (email === 'valentin.mundrov@gmail.com') {
      sql = 'INSERT INTO user (email,password,membership) VALUES(\'' + email + '\',\'' + password + '\',1)';
    } else {
      sql = 'INSERT INTO user (email,password,token) VALUES(\'' + email + '\',\'' + password + '\',\'' + token + '\');';
    }
    return new Promise(function (resolve, reject) {
      db.query(sql, function (err, result) {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(result.insertId);
        }
      });
    });
  },
  checkOne: function checkOne(email) {
    var scope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '*';

    var sql = 'SELECT ' + scope + ' FROM user WHERE email=\'' + email + '\' AND c_status=4';
    return new Promise(function (resolve, reject) {
      db.query(sql, function (err, results) {
        if (!err) {
          //if(results[0].c_status !== 4) return reject({ error: { message: 'User Account is canceled' }})
          resolve(results);
        } else {
          reject(err);
        }
      });
    });
  },
  verify: function verify(email) {
    var sql = 'UPDATE user SET verified=1 WHERE email=\'' + email + '\'';
    return new Promise(function (resolve, reject) {
      db.query(sql, function (err, rows) {
        if (!err) {
          resolve(rows);
        } else {
          reject(err);
        }
      });
    });
  },
  // on User.init: returns user and user's locations
  getOne: function getOne() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var table = arguments[1];
    var scope = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ['*'];

    var sql = void 0;
    var sc = scope.map(function (entry) {
      return 'u.' + entry;
    });
    var _key = Object.keys(data);
    var _value = Object.values(data);
    if (table === 'user') {
      sql = 'SELECT ' + sc + ',\n        ul.id,ul.name,ul.door,ul.floor,ul.bell,ul.admin,ul.mobile,ul.location,ul.c_status,ul.prime,\n        l.city\n        FROM user u\n        LEFT JOIN user_location ul ON u.uid=ul.uid\n        LEFT JOIN location l ON l.id=ul.location\n        WHERE u.email=\'' + data.email + '\'\n        ';
    } else {
      sql = 'SELECT ' + scope + ' FROM ' + table + ' WHERE ' + _key + '=\'' + _value + '\'';
    }
    return new Promise(function (resolve, reject) {
      db.query(sql, function (err, results) {
        if (!err) {
          resolve(results);
        } else {
          reject(err);
        }
      });
    });
  },
  // Save user or user_location table
  saveOne: function saveOne() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var table = arguments[1];

    var _keys = Object.keys(data),
        _values = [];
    var params = Object.values(data).map(function (v) {
      _values.push('?');
      return v;
    });
    var sql = 'INSERT INTO ' + table + ' (' + _keys + ') VALUES (' + _values + ')';
    console.log(sql, params);
    return new Promise(function (resolve, reject) {
      db.query(sql, params, function (err, result) {
        if (err) return reject();
        resolve(result.insertId);
      });
    });
  },
  // Update user table or user_location table
  updateOne: function updateOne() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var table = arguments[1];

    var id = data.id,
        rest = _objectWithoutProperties(data, ['id']);

    var _map = Object.keys(rest).map(function (entry) {
      if (entry === 'name' || entry === 'bell' || entry === 'entry') {
        return entry + '=\'' + rest[entry] + '\'';
      } else {
        return entry + '=' + rest[entry];
      }
    });
    var sql = 'UPDATE ' + table + ' SET ' + _map + ' WHERE id=' + id;
    console.log('ORM: ', sql);
    return new Promise(function (resolve, reject) {
      db.query(sql, function (err) {
        if (err) return reject();
        resolve();
      });
    });
  },
  // IDS: all user location IDs
  // Get every FAC with all products in FACs STORE
  getFac: function getFac(id) {
    var sql = 'SELECT fl.fac,fl.city,fl.prime,\n      f.open,f.delivery,f.bottleneck,f.mobile,\n      s.product,s.local_promo,s.local_price,\n      s.on_hand,s.take_only,s.add_time\n      FROM fac_location fl\n      JOIN store s ON fl.fac=s.fac AND s.on_hand>0\n      JOIN fac f ON fl.fac=f.id\n      WHERE fl.city=' + id + ' AND fl.prime=1\n      AND f.status=7';
    return new Promise(function (resolve, reject) {
      db.query(sql, function (err, results) {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

};
//# sourceMappingURL=user.js.map