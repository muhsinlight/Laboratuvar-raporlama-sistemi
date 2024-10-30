const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db.Connect");
const labo = sequelize.define("Labo", {
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    LaboAd: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    LaboSoyad: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    HastaneKimlikNumarası: {
        type: DataTypes.CHAR(7),
        allowNull: false
    }
}, {
    timestamps: false
});
module.exports = labo;