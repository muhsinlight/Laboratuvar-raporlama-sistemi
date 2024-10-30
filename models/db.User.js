const{Sequelize,DataTypes} = require('sequelize');
const sequelize= require('../config/db.Connect');
const bcrypt=require("bcrypt");

const User = sequelize.define("users",{
    username:{
        type:DataTypes.STRING(30),
        allowNull:false
    },
    password:{
        type:DataTypes.STRING(30),
        allowNull:false
    },
    role:{
        type:DataTypes.STRING(50),
        allowNull:false,
        defaultValue:"hasta"
    }
}, {
    timestamps: false 
});
  

    

module.exports=User;