/**
 * Created by macmini on 2/23/17.
 */


var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {

    res.render('profile', {});

});

module.exports = router;