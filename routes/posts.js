/**
 * Created by macmini on 7/18/17.
 * HealthE
 */


var express = require('express');
var router = express.Router();
var http = require('http');

var parse = require("parse/node").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF", "bctRQbnLCvxRIHaJTkv3gqhlwSzxjiMesjx8kEwo");

var CronJob = require('cron').CronJob;
var i = 0;

router.get('/', function(req, res, next) {
//startTimer();

});

router.post('/assignQuestion', function(req, res, next){
    res.sendStatus(200);
    var postObjectId = req.body.id;
    //assignQuestion(postObjectId, res);
    generateAnswer(postObjectId, res);
});


//generateAnswer
function generateAnswer(postObjectId, res){
    var date = new Date();
    var Posts = parse.Object.extend('Post');
    var query = new parse.Query(Posts);
    query.equalTo("objectId", postObjectId  );
    query.first({
        useMasterKey: true,
        success: function(object) {
            object.set("isAnswered", true);
            object.set("level", "low");
            object.set("comment", "Thanks for testing Sickcall! This is an example response to your health concern.");
            object.set("advisorUserId", "6Qb4plmxvq");
            object.save( null, {
                success: function(gameScore) {
                    
                    
                },
                error: function(gameScore, error) {
                    res.send('Failed to create new object, with error code: ' + error.message);
                }
            });
        },
        error: function(error) {
            //alert("Error: " + error.code + " " + error.message);
            res.send("Error: " + error.code + " " + error.message);
        }
    });
}

//assignQuestion
function assignQuestion(postObjectId, res){
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
}

//send question
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
                    //console.log("timer started");
                    sendNotification(userId);
                }
            });
        },
        error: function(error) {
            //alert("Error: " + error.code + " " + error.message);
            res.send("Error: " + error.code + " " + error.message);
        }
    });
}


//notification

function sendNotification(user){
    var message = "Hey, you've received a new health concern. You have 5 minutes to reply."

    var query = new parse.Query(parse.Installation);
    query.equalTo('userId', user);

    parse.Push.send({
        where: query,
        data: {
            alert: message,
            badge: 1,
            sound: 'default'
        }
    }, {
        useMasterKey: true,
        success: function (object) {
            //res.send(object);
            res.sendStatus(200);
        },
        error: function (error) {
            // There was a problem :(
            res.send(error);
        }
    });
}


module.exports = router;