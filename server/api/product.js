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
  options.port = 3306
}

//db = mysql.createConnection(options)
const db = mysql.createPool(options)

export default {
  getOne: () => {
    //
  }
}
