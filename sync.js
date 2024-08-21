const sequelize = require('./config/database');
const User = require('./models/user');
const Product = require('./models/product');

const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: true }); 
        console.log('Base de datos sincronizada.');
    } catch (error) {
        console.error('Error al sincronizar la base de datos:', error);
    }
};

syncDatabase();
