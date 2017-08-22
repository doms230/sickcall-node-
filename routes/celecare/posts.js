/**
 * Created by macmini on 7/18/17.
 */


var express = require('express');
var router = express.Router();
var http = require('http');

var parse = require("parse/node").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF", "bctRQbnLCvxRIHaJTkv3gqhlwSzxjiMesjx8kEwo");

router.get('/', function(req, res, next) {
   // var query = new parse.Query('Post');
   // var subscription = query.subscribe();
});

router.post('/nextAdvisor', function(req, res, next){
    var postObjectId = req.body.id;
    var date = new Date();
    var Posts = parse.Object.extend('_User');
    var query = new parse.Query(Posts);
    query.equalTo("isOnline", true);
    query.equalTo("isActive", true);
    query.ascending("questionQueue");
    query.first({
        useMasterKey: true,
        success: function(object) {
            console.log("got user: " + object.id);
            object.set("questionQueue", date);
            object.save( null, {
                success: function(gameScore) {
                    sendQuestion(postObjectId, object.id, res);
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
                    res.send("success");
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