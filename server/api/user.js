import mysql from 'mysql'
import dotenv from 'dotenv'

const config = require('../../config')

dotenv.config({silent: true})
const options = {
  user: config.get('MYSQL_USER'),
  password: config.get('MYSQL_PASSWORD'),
  database: config.get('MYSQL_DB'),
  host: 'localhost'// 172.17.0.6
}

if( config.get('INSTANCE_CONNECTION_NAME') && process.env.NODE_ENV === 'production' ) {
  options.socketPath = `/cloudsql/${config.get('INSTANCE_CONNECTION_NAME')}`
  options.port = 3306
}

console.log('Pool options: ',options)

const db = mysql.createPool(options)
db.on('connection', connection => console.log('DB connected'))
//db = mysql.createConnection(options)

export default {

    signup: data => {
      let sql
      const { email,password,token } = data

      let _keys = Object.keys(data), _values = []
      let params = Object.values(data).map( v => {
        _values.push('?')
        return v
      })
      //const sql = `INSERT INTO user (${_keys}) VALUES (${_values})`

      sql = `INSERT INTO user (${_keys}) VALUES (${_values})`
      //if(email==='valentin.mundrov@gmail.com'){
      //  sql = `INSERT INTO user (email,password,token,membership) VALUES('${email}','${password}','${token}',1)`
      //} else {
      //
      //  //`INSERT INTO user (email,password,token) VALUES('${email}','${password}','${token}');`
      //}
      console.log('Auth Insert: ',sql)
      return new Promise ((resolve,reject) => {
        db.query(sql, params, (err,result) => {
          if(err) return reject(err)
          resolve(result.insertId)
        })
      })
    },
// chek if user exist
    checkOne: (email,scope='*') => {
      const sql = `SELECT ${scope} FROM user WHERE email='${email}' AND c_status=4`
console.log(sql)
      return new Promise( (resolve, reject) => {
        db.query(sql, ( err,results ) => {
          if(err) return reject(err)
          resolve(results)
        })
      })
    },

// check user verified:
    verify: email => {
      const sql = `UPDATE user SET verified=1 WHERE email='${email}'`
      return new Promise( (resolve, reject) => {
        db.query(sql, ( err,rows ) => {
          if(err) return reject(err)
          resolve(rows)
        })
      })
    },

// on User.init: returns user and user's locations
    getOne: (data={},table,scope=['*']) => {
      let sql
      let sc = scope.map( entry => 'u.'+entry)
      const _key = Object.keys(data)
      const _value = Object.values(data)
      if(table==='user'){
        sql = `SELECT ${sc},
        ul.id,ul.name,ul.door,ul.floor,ul.bell,ul.admin,ul.mobile,ul.location,ul.c_status,ul.prime,
        l.city
        FROM user u
        LEFT JOIN user_location ul ON u.uid=ul.uid
        LEFT JOIN location l ON l.id=ul.location
        WHERE u.email='${data.email}'
        `
      } else {
        sql = `SELECT ${scope} FROM ${table} WHERE ${_key}='${_value}'`
      }
      return new Promise( (resolve,reject) => {
        db.query(sql, (err,results) => {
          if(err) return reject(err)
          resolve(results)
        })
      })
    },

// insert in user or new user_location table
    saveOne: (data={},table) => {
      let _keys = Object.keys(data), _values = []
      let params = Object.values(data).map( v => {
        _values.push('?')
        return v
      })
      const sql = `INSERT INTO ${table} (${_keys}) VALUES (${_values})`
      return new Promise( (resolve,reject) => {
        db.query(sql, params, (err,result) => {
          if (err) return reject(err)
          resolve(result.insertId)
        })
      })
    },

// Update user or user_location table
    updateOne: (data={},table) => {
      const {id, ...rest} = data
      const _map = Object.keys(rest).map( entry => {
        if (entry==='name' || entry==='bell' || entry==='entry')
        {
          return `${entry}='${rest[entry]}'`
        } else {
          return `${entry}=${rest[entry]}`
        }

      })
      const sql =`UPDATE ${table} SET ${_map} WHERE id=${id}`
      return new Promise( (resolve,reject) => {
        db.query(sql, err => {
          if (err) return reject(err)
          resolve()
        })
      } )
    },

// ID: location ID
// Get ever FAC with all products in FACs STORE
    getFac: city => {
      //f.id,f.city,f.prime,f.open,f.delivery,f.bottleneck,f.mobile
      const sql = `SELECT
      f.*,
      s.product,s.local_promo,s.local_price,s.on_hand,s.take_only,
      st.name AS street,
      l.number
      FROM fac f
      JOIN store s ON s.fac=f.id AND s.on_hand>0
      JOIN location l ON l.id=f.location_id
      JOIN street st ON st.id=l.street_id
      WHERE f.city=${city} AND f.prime=1
      AND f.status=7`

console.log('Get FACs: ', sql)
      return new Promise( (resolve,reject) => {
        db.query(sql, (err,results) => {
          if(err) return reject(err)
          resolve(results)
        })
      })
    }

}
