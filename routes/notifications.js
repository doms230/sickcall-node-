/**
 * Created by macmini on 8/12/16.
 */

var express = require('express');
var router = express.Router();
var http = require('http');

var parse = require("parse/node").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF",
    "bctRQbnLCvxRIHaJTkv3gqhlwSzxjiMesjx8kEwo");


/* GET home page. */
router.get('/', function(req, res, next) {

    var query = new parse.Query(parse.Installation);
    query.equalTo('userId', req.query.userId);

    parse.Push.send({
        where: query,
        data: {
            alert: req.query.message,
            badge: 1,
            sound: 'default'
        }
    }, {
        useMasterKey: true,
        success: function () {
            res.send("yeahah")
        },
        error: function (error) {
            // There was a problem :(
            res.send(error);
        }
    });
});

module.exports = router;