/**
 * Created by macmini on 6/5/16.
 */
var express = require('express');
var router = express.Router();
var parse = require("parse/node").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF",
    "bctRQbnLCvxRIHaJTkv3gqhlwSzxjiMesjx8kEwo");

var sinchAuth = require('sinch-auth');
var sinchSms = require('sinch-messaging');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('chat', {});
    console.log("to");

    /*var query = new parse.Query('Chat');
    query.equalTo('userId', 'PGAJ3hxM7X');
    var subscription = query.subscribe();

    subscription.on('open', () => {
        console.log('subscription opened');
    });

    subscription.on('create', (object) => {
        console.log('object created: ' + object.get('message'));
    });*/

    /*var query = new parse.Query('Chat');
     query.equalTo('userId', 'PGAJ3hxM7X');
     var subscription = query.subscribe();

     subscription.on('open', () => {
     console.log('subscription opened');
     });

     subscription.on('create', (object) => {
     console.log('object created: ' + object.get('message'));
     });*/

    var auth = sinchAuth("your-app-key", "your-app-secret");
    sinchSms.sendMessage("+16507141052", "Hello world!");
});

module.exports = router;