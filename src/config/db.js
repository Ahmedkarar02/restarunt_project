const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    "mysql://root:JMDaHgChIGhYnUrvyVrIwhwtrcmmYdAn@autorack.proxy.rlwy.net:47093/railway"
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = { sequelize, connectDB };
