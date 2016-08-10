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

   /* var Posts = parse.Object.extend('Post');
    var query = new parse.Query(Posts);
    query.equalTo("isRemoved", false);
    query.find({
        success: function(results) {
            // Do something with the returned Parse.Object values
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                //console.log(object.id + ' : ' + object.createdAt);

                //get post date
                var postDate = new Date(object.createdAt);

                // console.log(moment().diff(postDate,'hour'));
                var timeDifference = moment().diff(postDate,'hour');
                if (timeDifference => 2 ){
                    object.set("isRemoved", true);
                    console.log("greater");
                }
            }
            object.save();
        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });*/



});

module.exports = router;