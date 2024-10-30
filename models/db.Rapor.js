const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db.Connect');
const Labo = require("./db.Laborant");

const rapor = sequelize.define("Rapor", {
    RaporId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    HastaAd: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    HastaSoyad: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    HastaTC: {
        type: DataTypes.STRING(11),
        allowNull: false
    },
    TaniBasligi: {
        type: DataTypes.CHAR(55),
        allowNull: false
    },
    TaniDetaylari: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    Tarih: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Image: {
        type: DataTypes.STRING(500),
        allowNull: false
    }
}, {
    timestamps: false
});
rapor.hasMany(Labo, { foreignKey: 'RaporId' });
Labo.belongsTo(rapor, { foreignKey: 'RaporId' });

module.exports = rapor;
