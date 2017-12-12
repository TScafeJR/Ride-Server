const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
var User = require('./models/models.js').User;
var bcrypt = require('bcrypt');
var Spotify = require('./spotify.js').spotifyApi;
var SpotifyUrl = require('./spotify.js').authorizeURL;
var axios = require('axios');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(require('cookie-parser')());
// app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

/*
My passport strategy is below
*/

var passport = require('passport');
var LocalStrategy = require('passport-local');
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

var code;

app.post('/spotifyUpdate', (req, res) => {
    console.log(`${SpotifyUrl}`)
    axios.get(`${SpotifyUrl}`)
    .then((response) =>{
        console.log(`This is the response. hopefully it is the code\n ${response}`)
    })
    .catch((error)=>{
        console.log(`There was an error submitting the Spotify query to authenticate the user.\n
        Find more information below\n
        ${error}`)
    })
})

app.get('/spotify-success', (req, res) => {
// need to get the query stuff correct

// fetch(`https://accounts.spotify.com/api/token`, {
//     method: 'POST',
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       grant_type: "authorization_code",
//       code: password,
//       redirect_uri: 'https://the-app-ride.herokuapp.com/spotify-success',
//       client_id: process.env.SPOTIFY_CLIENT_ID,
//       client_secret: process.env.SPOTIFY_CLIENT_SECRET
//     })
//   })
//   .then((response) => {
//     console.log('response', response);
//     return response.json();
//   })
//   .then((responseJson) => {
//       console.log(`This is responseJson\n ${responseJson}`)
//   })
//   .catch((error)=>{
//     console.log(`There was an error making the request to the spotify API with your credentials to authenticate the user.\n
//     Find more information below\n
//     ${error}`)
//     })

    Spotify.authorizationCodeGrant(code)
    .then(function(data) {
    console.log('The token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);
    console.log('The refresh token is ' + data.body['refresh_token']);

    // Set the access token on the API object to use it in later calls
    Spotify.setAccessToken(data.body['access_token']);
    Spotify.setRefreshToken(data.body['refresh_token']);
    })
    .catch( (err) => {
    console.log('Something went wrong!', err);
    });
})

app.get('/profileImage', (req, res) => {
    res.send({success: true, photo: req.user.profile_URL})
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
