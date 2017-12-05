"use strict";

var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
    dialect: 'postgres'
});

sequelize
.authenticate()
.then(() => {
    console.log('Connection has been established successfully.');
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});

var User = sequelize.define( 'users', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique:  true
    },   
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = {
    sequelize,
    User
};