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
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    User.findOne({ where: { username: username }}).then(user => {
        if (bcrypt.compareSync(password, hash)) {
            console.log(`hash worked`)
            done(null, user);
        } else {
            done(null, false);
        }
    });
}));

/*
The login routes are below here
I put everything in the same file because this server file doesn't need extreme management to function
*/
//to hash the file




app.post('/register', function(req, res, next) {
    const saltRounds = 10;

    const hash = bcrypt.hashSync(req.body.password, saltRounds);

    User.create({username: req.body.username, password: hash})
    .then(function() {
        return User.findAll();
    })
    .then(function() {
      return console.log('user registered')
    //   res.redirect('/login');
    })
    .catch(function(error) {
      console.log(error)
    });
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

/*
Everything below this page is for the routes to this file
If this file exceeds about 500 lines of code then I will segment it to make it more manageable
*/
app.get('/', (req, res) => {
    res.send(`Success!`)
});

app.get('/second', function(req, res) {
    res.send(`This works!`)
});

app.listen(PORT, error => {
    error
    ? console.error(error)
    : console.info(`==> 🌎 Listening on port ${PORT}. Visit http://localhost:${PORT}/ in your browser.`);
});
