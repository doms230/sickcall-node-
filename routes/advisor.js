var express = require('express');
var router = express.Router();
var http = require('http');

var stripe = require("stripe")("sk_live_i757TXWOABq1CfpbtQVsZZAv");

var parse = require("parse/node").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF", "bctRQbnLCvxRIHaJTkv3gqhlwSzxjiMesjx8kEwo");

router.get('/', function(req, res, next) {
    res.render('advisor',{});
});

router.get('/app', function(req, res, next){
    res.redirect("https://itunes.apple.com/us/app/sickcall-adv/id1303793448?ls=1&mt=8");
});



module.exports = router;