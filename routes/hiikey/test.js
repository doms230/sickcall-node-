/**
 * Created by macmini on 2/24/16.
 */

var express = require('express');
var router = express.Router();
var Parse = require('parse/node');

/* GET users listing. */
router.get('/', function(req, res, next) {
    //res.send('respond with a resource');

    var GameScore = Parse.Object.extend("PublicPost");
    var query = new Parse.Query(GameScore);
    query.get("imE7v7b9co", {
        success: function(gameScore) {
            // The object was retrieved successfully.

            res.send(gameScore.get("Title"))
        },
        error: function(object, error) {
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
            res.send(error)
        }
    });
});



module.exports = router;