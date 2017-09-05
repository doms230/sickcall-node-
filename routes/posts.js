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

router.get('/', function(req, res, next) {


});

router.post('/assignQuestion', function(req, res, next){
    res.sendStatus(200);
    var postObjectId = req.body.id;
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
                    //startTimer(res);
                    //res.send("success");
                    //startTimer(res);
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

function startTimer(res){
     new CronJob('* 1 * * * *', function(error) {
        //res.send('You will see this message every second');
        if (error == null){
            res.send("donbe");

        } else {
            res.send(error);
        }
        
      }, null, true, 'America/Los_Angeles');
      //job.stop();
}


module.exports = router;