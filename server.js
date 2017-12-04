const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

var passport = require('passport');
var LocalStrategy = require('passport-local');

// passport.serializeUser(function(user, done) {
//     done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
//     User.findById(id).then(user=>
//     done(null, user)
//   )
//   .catch(function(error) {
//       console.log('deserialize error', error)
//       done(error);
//   })
// });

// passport.use(new LocalStrategy(function(username, password, done) {
//     User.findOne({ where: { username: username }}).then(user => {
//         if (user.password === password) {
//             done(null, user);
//         } else {
//             done(null, false);
//         }
//     });
// }));

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
