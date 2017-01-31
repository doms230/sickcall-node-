

var express = require('express');
var router = express.Router();
var Parse = require('parse/node');

/* GET users listing. */
router.get('/', function(req, res, next) {
    //res.send('respond with a resource');

    res.render('home',{});

});



module.exports = router;