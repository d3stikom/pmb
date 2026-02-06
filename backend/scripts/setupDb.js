const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const createDb = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'pmb_db'}\`;`);
        console.log(`Database '${process.env.DB_NAME || 'pmb_db'}' created or already exists.`);
        await connection.end();
    } catch (err) {
        console.error('Error creating database:', err);
        process.exit(1);
    }
};

createDb();
