const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('hastane', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize;
