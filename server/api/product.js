import mysql from 'mysql'
import dotenv from 'dotenv'
const config = require('../../config')

const options = {
  user: config.get('MYSQL_USER'),
  password: config.get('MYSQL_PASSWORD'),
  database: config.get('MYSQL_DB')
}

if( config.get('INSTANCE_CONNECTION_NAME') && config.get('NODE_ENV') === 'production' ) {
  options.socketPath = `/cloudsql/${config.get('INSTANCE_CONNECTION_NAME')}`
} else {
  options.host = 'localhost'
}

const db = mysql.createConnection(options)

export default {
  getOne: () => {
    //
  }
}
