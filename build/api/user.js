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

_dotenv2.default.config({ silent: true });
var options = {
  user: config.get('MYSQL_USER'),
  password: config.get('MYSQL_PASSWORD'),
  database: config.get('MYSQL_DB'),
  host: 'localhost' // 172.17.0.6
};

if (config.get('INSTANCE_CONNECTION_NAME') && process.env.NODE_ENV === 'production') {
  options.socketPath = '/cloudsql/' + config.get('INSTANCE_CONNECTION_NAME');
  options.port = 3306;
}

console.log('Pool options: ', options);

var db = _mysql2.default.createPool(options);
db.on('connection', function (connection) {
  return console.log('DB connected');
});
//db = mysql.createConnection(options)

exports.default = {

  signup: function signup(data) {
    var sql = void 0;
    var email = data.email,
        password = data.password,
        token = data.token;


    var _keys = Object.keys(data),
        _values = [];
    var params = Object.values(data).map(function (v) {
      _values.push('?');
      return v;
    });
    //const sql = `INSERT INTO user (${_keys}) VALUES (${_values})`

    sql = 'INSERT INTO user (' + _keys + ') VALUES (' + _values + ')';
    //if(email==='valentin.mundrov@gmail.com'){
    //  sql = `INSERT INTO user (email,password,token,membership) VALUES('${email}','${password}','${token}',1)`
    //} else {
    //
    //  //`INSERT INTO user (email,password,token) VALUES('${email}','${password}','${token}');`
    //}
    console.log('Auth Insert: ', sql);
    return new Promise(function (resolve, reject) {
      db.query(sql, params, function (err, result) {
        if (err) return reject(err);
        resolve(result.insertId);
      });
    });
  },
  // chek if user exist
  checkOne: function checkOne(email) {
    var scope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '*';

    var sql = 'SELECT ' + scope + ' FROM user WHERE email=\'' + email + '\' AND c_status=4';
    console.log(sql);
    return new Promise(function (resolve, reject) {
      db.query(sql, function (err, results) {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // check user verified:
  verify: function verify(email) {
    var sql = 'UPDATE user SET verified=1 WHERE email=\'' + email + '\'';
    return new Promise(function (resolve, reject) {
      db.query(sql, function (err, rows) {
        if (err) return reject(err);
        resolve(rows);
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
        console.log(results);
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // insert in user or new user_location table
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
    return new Promise(function (resolve, reject) {
      db.query(sql, params, function (err, result) {
        if (err) return reject(err);
        resolve(result.insertId);
      });
    });
  },

  // Update user or user_location table
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
    return new Promise(function (resolve, reject) {
      db.query(sql, function (err) {
        if (err) return reject(err);
        resolve();
      });
    });
  },

  // ID: location ID
  // Get ever FAC with all products in FACs STORE
  getFac: function getFac(city) {
    //f.id,f.city,f.prime,f.open,f.delivery,f.bottleneck,f.mobile
    var sql = 'SELECT\n      f.*,\n      s.product,s.local_promo,s.local_price,s.on_hand,s.take_only,\n      p.list,\n      st.name AS street,\n      l.number\n      FROM fac f\n      JOIN store s ON s.fac=f.id AND s.on_hand>0\n      JOIN product p on p.id=s.product\n      JOIN location l ON l.id=f.location_id\n      JOIN street st ON st.id=l.street_id\n      WHERE f.city=' + city + ' AND f.prime=1\n      AND f.status=7 ORDER BY p.list';

    //console.log('Get FACs: ', sql)
    return new Promise(function (resolve, reject) {
      db.query(sql, function (err, results) {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

};
//# sourceMappingURL=user.js.map