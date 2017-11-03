/**
 * Created by macmini on 4/12/16.
 */
var express = require('express');
var router = express.Router();
var http = require('http');

var parse = require("parse/node").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF",
    "bctRQbnLCvxRIHaJTkv3gqhlwSzxjiMesjx8kEwo");

var id;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home',{});
});

module.exports = router;