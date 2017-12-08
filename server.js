const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
var User = require('./models/models.js').User;
var bcrypt = require('bcrypt');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
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
        return User.create({username: uname, password: hash, email: req.body.email})
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
    : console.info(`==> 🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`);
});
