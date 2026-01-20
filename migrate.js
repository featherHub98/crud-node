// ORIGINAL PG CODE - KEPT FOR REFERENCE
// const { Pool, Client } = require('pg');
// const fs = require('fs');
// const path = require('path');
// require('dotenv').config();

// async function createDatabase() {
//     const client = new Client({
//         user: process.env.DB_USER,
//         host: process.env.DB_HOST,
//         password: process.env.DB_PASSWORD,
//         port: process.env.DB_PORT,
//     });

//     try {
//         await client.connect();
//         // Check if database exists
//         const result = await client.query(
//             "SELECT 1 FROM pg_database WHERE datname = $1",
//             [process.env.DB_NAME]
//         );

//         if (result.rows.length === 0) {
//             console.log(`Creating database ${process.env.DB_NAME}...`);
//             await client.query(`CREATE DATABASE "${process.env.DB_NAME}";`);
//             console.log('✓ Database created');
//         } else {
//             console.log('✓ Database already exists');
//         }
//     } finally {
//         await client.end();
//     }
// }

// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
// });

// async function migrateData() {
//     // First create the database if it doesn't exist
//     await createDatabase();
    
//     const client = await pool.connect();
//     try {
//         console.log('Starting migration...');
        
//         // Create products table
//         await client.query(`
//             CREATE TABLE IF NOT EXISTS products (
//                 id SERIAL PRIMARY KEY,
//                 name VARCHAR(255) NOT NULL UNIQUE,
//                 price VARCHAR(255) NOT NULL,
//                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//             );
//         `);
//         console.log('✓ Products table created/verified');

//         // Create users table
//         await client.query(`
//             CREATE TABLE IF NOT EXISTS users (
//                 id SERIAL PRIMARY KEY,
//                 username VARCHAR(255) NOT NULL UNIQUE,
//                 email VARCHAR(255) NOT NULL,
//                 password VARCHAR(255) NOT NULL,
//                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//             );
//         `);
//         console.log('✓ Users table created/verified');

//         // Read db.json
//         const dbPath = path.join(__dirname, 'data', 'db.json');
//         const rawData = fs.readFileSync(dbPath, 'utf-8');
//         const db = JSON.parse(rawData);

//         // Clear existing data
//         await client.query('DELETE FROM products;');
//         await client.query('DELETE FROM users;');
//         console.log('✓ Cleared existing data');

//         // Migrate products
//         if (db.products && db.products.length > 0) {
//             for (const product of db.products) {
//                 await client.query(
//                     'INSERT INTO products (id, name, price) VALUES ($1, $2, $3)',
//                     [product.id, product.name, product.price]
//                 );
//             }
//             console.log(`✓ Migrated ${db.products.length} products`);
//         }

//         // Migrate users
//         if (db.users && db.users.length > 0) {
//             for (const user of db.users) {
//                 await client.query(
//                     'INSERT INTO users (id, username, email, password) VALUES ($1, $2, $3, $4)',
//                     [user.id, user.username, user.email, user.password]
//                 );
//             }
//             console.log(`✓ Migrated ${db.users.length} users`);
//         }

//         console.log('\n✓ Migration completed successfully!');
//     } catch (error) {
//         console.error('Migration error:', error);
//         throw error;
//     } finally {
//         await client.end();
//         await pool.end();
//     }
// }

// SEQUELIZE IMPLEMENTATION
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Product = require('./models/Product');
const User = require('./models/User');

async function createDatabase() {
    const sequelize = new Sequelize(
        'postgres', // Connect to default postgres database
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: 'postgres',
            logging: false
        }
    );

    try {
        await sequelize.authenticate();
        // Check if database exists
        const results = await sequelize.query(
            "SELECT 1 FROM pg_database WHERE datname = :dbName",
            {
                replacements: { dbName: process.env.DB_NAME },
                type: Sequelize.QueryTypes.SELECT
            }
        );

        if (!results || results.length === 0) {
            console.log(`Creating database ${process.env.DB_NAME}...`);
            await sequelize.query(`CREATE DATABASE "${process.env.DB_NAME}";`);
            console.log('✓ Database created');
        } else {
            console.log('✓ Database already exists');
        }
    } finally {
        await sequelize.close();
    }
}

async function migrateData() {
    // First create the database if it doesn't exist
    await createDatabase();
    
    const sequelize = require('./services/db');
    
    try {
        console.log('Starting migration...');
        
        // Sync models (create tables if they don't exist)
        await sequelize.sync({ alter: false }); // Use alter: true to modify existing tables
        console.log('✓ Products table created/verified');
        console.log('✓ Users table created/verified');

        // Read db.json
        const dbPath = path.join(__dirname, 'data', 'db.json');
        const rawData = fs.readFileSync(dbPath, 'utf-8');
        const db = JSON.parse(rawData);

        // Clear existing data
        await Product.destroy({ where: {}, truncate: true });
        await User.destroy({ where: {}, truncate: true });
        console.log('✓ Cleared existing data');

        // Migrate products
        if (db.products && db.products.length > 0) {
            await Product.bulkCreate(db.products, { 
                ignoreDuplicates: true 
            });
            console.log(`✓ Migrated ${db.products.length} products`);
        }

        // Migrate users
        if (db.users && db.users.length > 0) {
            await User.bulkCreate(db.users, { 
                ignoreDuplicates: true 
            });
            console.log(`✓ Migrated ${db.users.length} users`);
        }

        console.log('\n✓ Migration completed successfully!');
    } catch (error) {
        console.error('Migration error:', error);
        throw error;
    } finally {
        await sequelize.close();
    }
}

migrateData().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
