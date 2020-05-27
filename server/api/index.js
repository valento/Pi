import mysql from 'mysql'
import dotenv from 'dotenv'
const config = require('../../config')

const options = {
  user: config.get('MYSQL_USER'),
  password: config.get('MYSQL_PASSWORD'),
  database: config.get('MYSQL_DB'),
  host: 'localhost'
}

if( config.get('INSTANCE_CONNECTION_NAME') && config.get('NODE_ENV') === 'production' ) {
  options.socketPath = `/cloudsql/${config.get('INSTANCE_CONNECTION_NAME')}`
  //options.host = '172.17.0.6'
  options.port = 3306
}

const db = mysql.createPool(options)
db.on('connection', connection => console.log('DB connected'))

export default {
  getOne: (data={},table,scope=['*']) => {
    let sql
    let sc = scope.map( entry => 'u.'+entry)
    const _key = Object.keys(data)
    const _value = Object.values(data)
    if(table==='user'){
      sql = `SELECT ${sc},
      ul.id,ul.name,ul.door,ul.floor,ul.bell,ul.ref,ul.admin,ul.mobile,ul.location,ul.c_status,ul.prime
      FROM user u
      LEFT OUTER JOIN user_location ul ON u.uid=ul.uid
      WHERE u.email='${data.email}'
      `
    } else {
      sql = `SELECT ${scope} FROM ${table} WHERE ${_key}='${_value}'`
    }
  console.log(sql)
    return new Promise( (resolve,reject) => {
      db.query(sql, (err,results) => {
        if(table==='user'){console.log('User Init data: ',results)}
        if(!err) {
          resolve(results)
        } else {
          reject(err)
        }
      })
    })
  },

  // GET Location by REP = location.uid
  getOneReference: (data={},table,scope=['*']) => {
    let sql, l
    if(isNaN(data.uid)){
      l = 'l.uid'
    } else {
      l = 'l.id'
    }
    sql = `SELECT l.number,l.id,s.name
    FROM location l INNER JOIN street s
    WHERE ${l}='${data.uid}'
    AND s.id=l.street_id`
console.log(sql)
    return new Promise( (resolve,reject) => {
      db.query(sql, (err,results) => {
        if(!err) {
console.log(results)
          resolve(results)
        } else {
          reject(err)
        }
      })
    })
  },

  getList: (table,scope=['*'],params=null) => {
    let PARAMS = '', sql
    const _key = params? Object.keys(params) : null
    if(_key && _key.length > 0) {
      const kk = _key.map( k => {
        return table==='orders'? `${k}=${params[k]}` : `${k}=${params[k]}`
      })
      PARAMS = (_key.length > 1)? kk.join(' AND ') : kk[0]
      if( table === 'product' ) {
        PARAMS = PARAMS.concat(' ORDER BY list')
      }
    }
    //else if(_key) {
    //  PARAMS = `${_key[0]}=${params._key[0]}`
    //}
    if (table==='orders') {
      sql = `SELECT
      o.id,o.uid,o.promo_id as order_promo,o.ordered_at,o.pick_up_time,o.delivery,o.user_location,
      od.item,od.quant,od.delay,od.promo_id,od.options
      FROM orders o
      JOIN order_detail od ON od.order_id=o.id
      WHERE ${PARAMS}`
    } else {
      sql = !params? `SELECT {${scope}} FROM ${table}` :
      `SELECT ${scope} FROM ${table} WHERE ${PARAMS}`
    }
console.log(sql)
    return new Promise( (resolve,reject) => {
      db.query(sql, (err,results) => {
        console.log(results)
        if(err) return reject(err)
        resolve(results)
      })
    })
  },

  saveMany: (data=[],table) => {
    let _keys = Object.keys(data[0])
    let params = data.map( i => {
      let v = Object.values(i)
      return v
    })
    const sql = `INSERT INTO ${table} (${_keys}) VALUES ?`
console.log(sql,[params])
    return new Promise( (resolve,reject) => {
      db.query(sql, [params], err => {
        if (err) return reject(err)
        resolve()
      })
    })
  },
  saveOne: (data={},table) => {
    let _keys = Object.keys(data), _values = []
    let params = Object.values(data).map( v => {
      _values.push('?')
      return v
    })
    const sql = `INSERT INTO ${table} (${_keys}) VALUES (${_values})`
console.log(sql,params)
    return new Promise( (resolve,reject) => {
      db.query(sql, params, (err,result) => {
        if (err) return reject(err)
        resolve(result.insertId)
      })
    })
  },
  saveOneLocation: (data={},table) => {
    let jsn='',sql=''
    const {bg,lat,uid,street_id,city,number} = data

    switch(table) {
      case 'city':
        jsn = `'{"bg": "${bg}", "en": "${lat}", "es": "${lat}"}'`
        sql = `INSERT INTO ${table} (name,code) VALUES (${jsn},${data.code})`
      break
      case 'street':
        jsn = `'{"bg": "${bg}", "en": "${lat}", "es": "${lat}"}'`
        sql = `INSERT INTO ${table} (name,city) VALUES (${jsn},${data.city})`
      break
      case 'location':
      console.log(data)
        sql = `INSERT INTO ${table} (uid,city,street_id,number)
        VALUES ('${uid}',${city},${street_id},${number})`
      break
    }

  console.log(sql,data)
    return new Promise( (resolve,reject) => {
      db.query(sql, err => {
        if (err) return reject()
        resolve()
      })
    })
  },
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
    const sql = table==='user'? `UPDATE ${table} SET ${_map} WHERE uid=${id}` :
    `UPDATE ${table} SET ${_map} WHERE id=${id}`
console.log('Update ORM: ',sql)
    return new Promise( (resolve,reject) => {
      db.query(sql, err => {
        if (err) return reject()
        resolve()
      })
    } )
  },
  updateMany: (data={},table) => {
    const sql = `UPDATE ${table} SET status=2 WHERE id IN (${data.id})`
console.log('Update many: ',data.id)
    return new Promise( (resolve,reject) => {
      db.query(sql, err=>{
        if(err) return reject()
        resolve()
      })
    })
  }
}
