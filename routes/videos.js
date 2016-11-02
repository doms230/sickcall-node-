/**
 * Created by macmini on 10/2/16.
 */
var express = require('express');
var router = express.Router();
var http = require('http');

var parse = require("parse/node").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF",
    "bctRQbnLCvxRIHaJTkv3gqhlwSzxjiMesjx8kEwo");

/* GET home page. */
router.get('/', function(req, res, next) {
    var postId = req.query.id;

    var GameScore = parse.Object.extend("Post");
    var query = new parse.Query(GameScore);
    query.get(postId, {
        success: function(object) {
            // The object was retrieved successfully.
            var videoUrl = object.get("post");
            console.log(videoUrl.url());
            res.render('video',{
                video: videoUrl.url()
            });
        },
        error: function(object, error) {
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
        }
    });
});

module.exports = router;