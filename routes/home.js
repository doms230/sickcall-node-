/**
 * Created by macmini on 4/12/16.
 */
var express = require('express');
var router = express.Router();
var http = require('http');

var parse = require("parse/node").Parse;
//parse.initialize("pwneJNtOqdAJlPtartF1GbtaOqCL46iyjegNbAyB",
   // "ZwdTh7WxOkLhBj6pFyZ7bTVk0DLyGuNYZR6bBszQ");
var moment = require("moment");
var msecPerMinute = 1000 * 60;
var msecPerHour = msecPerMinute * 60;

var currentDate = new Date();

//TODO: Make sure date is cuncurrent with timezone
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home',{});
});

module.exports = router;