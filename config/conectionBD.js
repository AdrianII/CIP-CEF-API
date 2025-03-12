const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: 'postgres',//process.env.DB_USER,
    host: 'localhost',//process.env.DB_HOST,
    database: 'postgres',//process.env.DB_NAME,
    password: '3ddn0!',//process.env.DB_PASSWORD,
    port: 5432,//process.env.DB_PORT
});

pool.connect()
    .then(() => console.log('✅ Conectado a PostgreSQL'))
    .catch(err => console.error('❌ Error de conexión:', err));

module.exports = pool;