const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
var User = require('./models/models.js').User;
var bcrypt = require('bcrypt');
var axios = require('axios');


app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

/*
My passport strategy is below
*/

var passport = require('passport');
var LocalStrategy = require('passport-local');
const SpotifyStrategy = require('passport-spotify').Strategy;
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id).then(user=>
    done(null, user)
  )
  .catch(function(error) {
      console.log('deserialize error', error)
      done(error);
  })
});

passport.use(new LocalStrategy(function(username, password, done) {
    var uname = username.toLowerCase()
    User.findOne({ where: { username: uname }})
    .then(user => {
      if(user) {
        bcrypt.compare(password, user.password, function(err, res){
            if (res){
                done(null, user);
            } else {
                console.log(`The hash did not work for you \n ${err}`);
                done(null, false);
            }
        });
      } else {
        done(null, false);
      }
    })
    .catch(function(error){
        console.log(`There was an error with the Local Strategy\n ${error}`);
    })
}));

    passport.use(new SpotifyStrategy({
        clientID: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        callbackURL: "https://the-app-ride.herokuapp.com/spotify-success"
    },
    function(accessToken, refreshToken, profile, done) {
        var access = accessToken;
        User.findOne({
            spotifyId: profile.id
        }, function(err, user) {
        if (err) {return done(err);}
    //No user was found... so create a new user with values from Facebook (all the profile. stuff)
        if (!user) {
            user = new User({
                username: profile.displayName,
                profilePhoto: profile.photos[0],
                access: access,
                spotifyId: profile.id,
                provider: 'spotify',
                //now in the future searching on User.findOne({'facebook.id': profile.id } will match because of this next line
                });
                user.save(function(err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            } else {
                //found user. Return
                user.access = access;
                user.save(function(err){
                if(err) console.log(err);
                return done(err, user);
                })
            }
    });
    })
    )

/*
The login routes are below here
I put everything in the same file because this server file doesn't need extreme management to function
*/
//to hash the file

var validateReq = function(userData) {
    if (userData.password !== userData.passwordRepeat) {
      return "Passwords don't match.";
    }

    if (!userData.username) {
      return "Please enter a username.";
    }

    if (!userData.password) {
      return "Please enter a password.";
    }
};

app.post('/register', function(req, res, next) {
    var error = validateReq(req.body);
    if (error) {
      res.json({error: error})
    }

    const saltRounds = 10;

    bcrypt.hash(req.body.password, saltRounds)
    .then(function(hash) {
        var uname = req.body.username.toLowerCase()
        return User.create({username: uname, password: hash, email: req.body.email, profile_URL: 'http://bit.ly/2AuipjI'})
    })
    .then(function() {
        return User.findAll();
    })
    .then(function() {
        console.log('user registered')
        return res.json({success: true})
    })
    .catch(function(error) {
      console.log(`There was an error registering the User\n ${error}`)
    });


});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/loginFail'
}));

app.get('/loginFail', (req, res) => {
  return res.json({success: false});
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

/*
Everything below this page is for the routes to this file
If this file exceeds about 500 lines of code then I will segment it to make it more manageable
*/
app.get('/', (req, res) => {
    return res.json({success: true})
});

app.post('/fbupdate', (req, res) => {
    User.update({
        facebookID: req.body.facebookID,
        facebookName: req.body.facebookName
    }, {
        where: {id: req.user.id},
        returning: true,
        plain: true
    })
    .then(function(result){
        console.log(result[1].dataValues)
        res.send({success: true})
    })
    .catch(function(error){
        console.log(`There was an error updating the facebook model\n ${error}`)
        res.send({success:false})
    })
})

app.post('/photoUpdate', (req, res) => {
    User.update({
        profile_URL: req.body.profileURL
    }, {
        where: {id: req.user.id},
        returning: true,
        plain: true
    })
    .then(function(result){
        res.send({success: true})
    })
    .catch(function(error){
        console.log(`There was an error updating the User's profile photo\n ${error}`)
        res.send({success: false})
    })
})

app.get('/yourCar', (req, res) => {
    Car.findOne({ where: { userId: req.user.id }})
    .then((response) =>{
        console.log(response)
        res.send({car: response});
    })
    .catch((error) => {
        console.log(`There was an error with your car\n${error}`)
    })
})

app.post('/carPhotoUpdate', (req, res)=>{
    Car.findOne({ where: { userId: req.user.id }})
    .then((response) =>{
        if (response){
            Car.update({
                image: req.body.image
            })
            .then((response)=>{
                console.log(`Car photo updated`)
            })
            .catch((error) =>{
                console.log(`There was an error updating the car photo\n${error}`)
            })
        } else {
            Car.create({
                image: req.body.image,
                userId: req.user.id
            })
            .then((response)=>{
                console.log(`Car photo created`)
            })
            .catch((error) =>{
                console.log(`There was an error creating the car photo\n${error}`)
            })
        }
    })
    .then((submission) => {
        res.json({success: true})
    })
    .catch((error) => {
        console.log(`There was an error authenticating the Car model\n${error}`)
        res.json({success: false})
    })
})

app.post('/carUpdate', (req, res) => {
    Car.findOne({ where: { userId: req.user.id }})
    .then((response) =>{
        if (response){
            Car.update({
                license_plate: req.body.licensePlate,
                make: req.body.make,
                model: req.body.model,
                year: req.body.year,
                color: req.body.color
            })
            .then((response)=>{
                console.log(`Car updated`)
            })
            .catch((error) =>{
                console.log(`There was an error updating the car model\n${error}`)
            })
        } else {
            Car.create({
                license_plate: req.body.licensePlate,
                make: req.body.make,
                model: req.body.model,
                year: req.body.year,
                userId: req.user.id,
                color: req.body.color
            })
            .then((response)=>{
                console.log(`Car model created`)
            })
            .catch((error) =>{
                console.log(`There was an error creating the car model\n${error}`)
            })
        }
    })
    .then((submission) => {
        res.json({success: true})
    })
    .catch((error) => {
        console.log(`There was an error authenticating the Car model\n${error}`)
        res.json({success: false})
    })
})

app.post('/profileUpdate', (req, res) => {
    var d = new Date();
    var dd = parseInt(`${req.body.day}`);
    var mm = parseInt(`${req.body.month}`) - 1;
    var yy = parseInt(`${req.body.year}`);
    d.setFullYear(yy, mm, dd)
    User.update({
        profile_URL: req.body.image,
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        birthday: d,
        bio: req.body.bio,
        hometown: req.body.hometown
    }, {
        where: {id: req.user.id},
        returning: true,
        plain: true
    })
    .then(function(result){
        res.send({success: true})
    })
    .catch(function(error){
        console.log(`There was an error updating the User's Profile\n${error}`)
        res.send({success: false})
    })
})

app.get('/spotifyUpdate', (req, res) => {
    // console.log(`${SpotifyUrl}`)
    // axios.get(`${SpotifyUrl}`)
    // .then((response) =>{
    //     console.log(`Hit the spotify route`)
    //     res.json({url: SpotifyUrl} )
    // })
    // .catch((error)=>{
    //     console.log(`There was an error submitting the Spotify query to authenticate the user.\n
    //     Find more information below\n
    //     ${error}`)
    // })


})

app.get('/profileImage', (req, res) => {
    res.send({success: true, photo: req.user.profile_URL})
})

app.get('/profile', (req, res) => {
    res.send({
        success: true,
        photo: req.user.profile_URL,
        first_name: req.user.firstName,
        last_name: req.user.lastName,
        bithday: req.user.birthday,
        hometown: req.user.hometown,
        bio: req.user.bio
    })
})

app.get('/second', function(req, res) {
    res.send(`This works!`)
});

app.get('/logout', function(req, res) {
    req.logout()
    res.json({success: true})

})

app.listen(PORT, error => {
    error
    ? console.error(error)
    : console.info(`🌎\nListening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`);
});
