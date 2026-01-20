// const { Pool } = require('pg');
// require('dotenv').config();

// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST || '127.0.0.1',
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: parseInt(process.env.DB_PORT) || 5432,
//     max: 20,
//     idleTimeoutMillis: 30000,
//     connectionTimeoutMillis: 2000,
// });

// pool.on('error', (err) => {
//     console.error('Unexpected error on idle client', err);
// });

// module.exports = pool;

const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || '127.0.0.1',
        port: parseInt(process.env.DB_PORT) || 5432,
        dialect: 'postgres',
        pool: {
            max: 20,
            min: 0,
            acquire: 2000,
            idle: 30000
        },
        logging: false 
    }
);

sequelize.authenticate()
    .then(() => {
        console.log('Database connection established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;
