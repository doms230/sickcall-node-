var express = require('express');
var router = express.Router();
var http = require('http');

router.get('/', function(req, res, next) {
    res.render('about',{});
});



module.exports = router;