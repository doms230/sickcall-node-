/**
 * Created by macmini on 8/12/16.
 */

var express = require('express');
var router = express.Router();
var http = require('http');

var parse = require("parse/node").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF",
    "bctRQbnLCvxRIHaJTkv3gqhlwSzxjiMesjx8kEwo");

var api_key = 'key-931116e92b651622b653efef865d7a66';
var domain = 'reset.hiikey.com';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
var mailcomposer = require('mailcomposer');

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

    /*var data = {
        from: 'noreply@hiikey.com',
        to: 'dom@hiikey.com',
        subject: 'Hello',
        text: 'still send some text to be on the safe side',
        html:"<h1> What's up </h1>" +
        "<button href=https://www.hiikey.com > Go Now </button>"
    };

    mailgun.messages().send(data, function (error, body) {
        console.log(body);

    });*/

   /* var mail = mailcomposer({
        from: 'noreply@hiikey.com',
        to: 'dom@hiikey.com',
        subject: 'Test email subject',
        body: 'Test email text'
    });

    mail.build(function(mailBuildError, message) {

        var dataToSend = {
            to: 'dom@hiikey.com',
            message: '/Users/macmini/WebstormProjects/hiikeynode/views/test.html'
        };

        mailgun.messages().sendMime(dataToSend, function (sendError, body) {
            if (sendError) {
                console.log(sendError);
                return;
            }
        });
    });*/

});

module.exports = router;