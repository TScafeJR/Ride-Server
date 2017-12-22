"use strict";

var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DATABASE_URI);

sequelize.authenticate()
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
        type: Sequelize.TEXT,
        allowNull: true
    }
})

var Trip = sequelize.define('trips', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    departure_street_number: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    departure_street: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    departure_city: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    departure_state: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    departure_zip_code: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    departure_latitude: {
        type: Sequelize.DECIMAL,
        allowNull: true
    },
    departure_longitude: {
        type: Sequelize.DECIMAL,
        allowNull: true
    },
    destination_street_number: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    destination_street: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    destination_city: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    destination_state: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    destination_zip_code: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    destination_latitude: {
        type: Sequelize.DECIMAL,
        allowNull: true
    },
    destination_longitude: {
        type: Sequelize.DECIMAL,
        allowNull: true
    },
    date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    num_seats: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    remaining_seats: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    trip_details: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    cost: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    fun_trip_url: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    // likes: {
    //     type
    // }
})

var Seat = sequelize.define('seats', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    cost: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    pickup_street_number: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    pickup_street: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    pickup_city: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    pickup_state: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    pickup_zip_code: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    pickup_latitude: {
        type: Sequelize.DECIMAL,
        allowNull: true
    },
    pickup_longitude: {
        type: Sequelize.DECIMAL,
        allowNull: true
    },
    dropoff_street_number: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    dropoff_street: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    dropoff_city: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    dropoff_state: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    dropoff_zip_code: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    dropoff_latitude: {
        type: Sequelize.DECIMAL,
        allowNull: true
    },
    dropoff_longitude: {
        type: Sequelize.DECIMAL,
        allowNull: true
    },
})

var Friend = sequelize.define('friends', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    user1ReqId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    user2ResId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

var Payment = sequelize.define('payments', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    stripeBrand: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    stripeCustomerId: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    stripeExpMonth: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    stripeExpYear: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    stripeLast4: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    stripeSource: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    status: {
        type: Sequelize.TEXT,
        allowNull: true
    },
})

Car.belongsTo(User);
Trip.belongsTo(User);
Seat.belongsTo(Trip);
Seat.belongsTo(User);
User.hasMany(Trip, {as: 'trips'});
Trip.belongsTo(User);
Trip.hasMany(Seat, {as: 'seats'});
Payment.belongsTo(User);


module.exports = {
    sequelize,
    User,
    Car,
    Trip,
    Seat,
    Friend,
    Payment
};
