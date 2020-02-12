import mysql from 'mysql'
import dotenv from 'dotenv'

const config = require('../../config')

dotenv.config({silent: true})
const options = {
  user: config.get('MYSQL_USER'),
  password: config.get('MYSQL_PASSWORD'),
  database: config.get('MYSQL_DB')
}

if( config.get('INSTANCE_CONNECTION_NAME') && process.env.NODE_ENV === 'production' ) {
  options.socketPath = `/cloudsql/${config.get('INSTANCE_CONNECTION_NAME')}`
} else {
  options.host = 'localhost'
}

const db = mysql.createConnection(options)

export default {

    signup: data => {
      let sql = ``
      const { email,password,token } = data
      if(email==='valentin.mundrov@gmail.com'){
        sql = `INSERT INTO user (email,password,token,membership) VALUES('${email}','${password}','${token}',1)`
      } else {
        sql = `INSERT INTO user (email,password,token) VALUES('${email}','${password}','${token}');`
      }
      console.log('Auth Insert: ',sql)
      return new Promise ((resolve,reject) => {
        db.query(sql, (err,result) => {
          if(err) {
            console.log(err)
            reject(err)
          } else {
            resolve(result.insertId)
          }
        })
      })
    },
    checkOne: (email,scope='*') => {
      const sql = `SELECT ${scope} FROM user WHERE email='${email}' AND c_status=4`

      return new Promise( (resolve, reject) => {
        db.query(sql, ( err,results ) => {
          if(!err) {
            //if(results[0].c_status !== 4) return reject({ error: { message: 'User Account is canceled' }})
            resolve(results)
          } else {
            console.log('API CheckOne User: ',err)
            reject(err)
          }
        })
      })
    },
    verify: email => {
      const sql = `UPDATE user SET verified=1 WHERE email='${email}'`
      return new Promise( (resolve, reject) => {
        db.query(sql, ( err,rows ) => {
          if(!err) {
            resolve(rows)
          } else {
            reject(err)
          }
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

          if(!err) {
            resolve(results)
          } else {
            reject(err)
          }
        })
      })
    },
// Save user or user_location table
    saveOne: (data={},table) => {
      let _keys = Object.keys(data), _values = []
      let params = Object.values(data).map( v => {
        _values.push('?')
        return v
      })
      const sql = `INSERT INTO ${table} (${_keys}) VALUES (${_values})`
      return new Promise( (resolve,reject) => {
        db.query(sql, params, (err,result) => {
          if (err) return reject()
          resolve(result.insertId)
        })
      })
    },
// Update user table or user_location table
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
          if (err) return reject()
          resolve()
        })
      } )
    },
// ID: location ID
// Get ever FAC with all products in FACs STORE
    getFac: id => {
      const sql = `SELECT f.id,f.city,f.prime,
      f.open,f.delivery,f.bottleneck,f.mobile,
      s.product,s.local_promo,s.local_price,
      s.on_hand,s.take_only,s.add_time
      FROM fac f
      JOIN store s ON f.id=s.fac AND s.on_hand>0
      WHERE f.city=${id} AND f.prime=1
      AND f.status=7`
      return new Promise( (resolve,reject) => {
        db.query(sql, (err,results) => {
          if(err) return reject(err)
          resolve(results)
        })
      })
    }

}
