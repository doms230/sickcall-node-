/**
 * Created by macmini on 3/1/17.
 */

var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {

    res.render('new', {});

});

module.exports = router;