const express = require('express');
const router = express.Router();
router.use(passport.initialize());
router.use(passport.session());

router.get('/second', function(req, res) {
    res.send(`This works!`)
});

module.exports = router;
