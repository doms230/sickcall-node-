/**
 * Created by macmini on 7/18/17.
 * HealthE
 */


var express = require('express');
var router = express.Router();
var http = require('http');

var parse = require("parse/node").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF", "bctRQbnLCvxRIHaJTkv3gqhlwSzxjiMesjx8kEwo");

var schedule = require('node-schedule');
//var io = require('socket.io')('5000');


router.get('/', function(req, res, next) {
   // var query = new parse.Query('Post');
   // var subscription = query.subscribe();
   //res.send("asdf");

    // A new countdown timer with 60 seconds 
   //var socket = io.connect('http://localhost:5000');
    //res.send("asdf");
   /* io.on('counter', function(count){
       console.log(count);
      });*/

});

router.get('/assignQuestion', function(req, res, next){
    var postObjectId = req.query.id;
    var date = new Date();
    var Posts = parse.Object.extend('Advisor');
    var query = new parse.Query(Posts);
    query.equalTo("isOnline", true);
    query.equalTo("isActive", true);
    query.ascending("questionQueue");
    query.first({
        useMasterKey: true,
        success: function(object) {
            let user = object.get("userId");
            console.log("got user: " + user);
            object.set("questionQueue", date);
            object.save( null, {
                success: function(gameScore) {
                    sendQuestion(postObjectId, user, res);
                    //res.send("success");
                },
                error: function(gameScore, error) {
                // Execute any logic that should take place if the save fails.
                // error is a Parse.Error with an error code and message.
                    res.send('Failed to create new object, with error code: ' + error.message);
                }
            });
        },
        error: function(error) {
            //alert("Error: " + error.code + " " + error.message);
            res.send("Error: " + error.code + " " + error.message);
        }
    });
});

function sendQuestion(postId, userId, res){
    var Posts = parse.Object.extend('Post');
    var query = new parse.Query(Posts);
    query.equalTo("objectId", postId);
    query.first({
        useMasterKey: true,
        success: function(result) {
            console.log("userId: " + userId);
            result.set("advisorUserId", userId);
            result.save( null, {
                success: function(gameScore) {
                    console.log("timer started");
                    //res.send("success");
                    startTimer(res);
                    //send notification to patient that so and so will be answering their question
                    //send notification to advisor that they have a question waiting for them
                }
            });
        },
        error: function(error) {
            //alert("Error: " + error.code + " " + error.message);
            res.send("Error: " + error.code + " " + error.message);
        }
    });
}


module.exports = router;