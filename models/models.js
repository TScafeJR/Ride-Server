"use strict";

var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DATABASE_URI);

sequelize
.authenticate()
.then(() => {
    console.log('Connection to your database has been established successfully.');
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
    },
    email: {
        type: Sequelize.TEXT,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    first_name: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    last_name: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    birthday: {
        type: Sequelize.DATE,
        allowNull: true
    },
    bio: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    hometown: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    facebookName: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    facebookID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: true
    },
    profile_URL: {
        type: Sequelize.TEXT,
        allowNull: true
    }
})

var Car = sequelize.define( 'cars', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    image: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: true
    },
    license_plate: {
        type: Sequelize.TEXT,
        allowNull: true,
        unique: true
    },
    make: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    model: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    year: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    color: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
})

Car.belongsTo(User)

module.exports = {
    sequelize,
    User,
    Car
};