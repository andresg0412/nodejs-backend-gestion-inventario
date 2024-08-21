const { Sequelize } = require('sequelize');
require('dotenv').config();

const environment = process.env.NODE_ENV || 'development';

const config = {
    development: {
        database: process.env.DB_NAME || 'magiclog',
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '1234',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false,
    },
    production: {
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            }
        },
        logging: false,
    }
};

const sequelize = new Sequelize(config[environment]);

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
}

testConnection();

module.exports = sequelize;
