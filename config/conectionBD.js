const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: 'postgres',//process.env.DB_USER,
    //host: '10.21.64.101',//process.env.DB_HOST,
    host: '127.0.0.1',//process.env.DB_HOST,
    //database: 'BD_CEF',//process.env.DB_NAME,
    database: 'postgres',//process.env.DB_NAME,
    password: '3ddn0!',//process.env.DB_PASSWORD,
    port: 5432,//process.env.DB_PORT
});

pool.connect()
    .then(() => console.log('✅ Conectado a PostgreSQL'))
    .catch(err => console.error('❌ Error de conexión:', err));

module.exports = pool;