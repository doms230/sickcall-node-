/**
 * Created by d_innovator on 1/13/17.
 */


var express = require('express');
var router = express.Router();
var http = require('http');

var client = require('twilio')('AC847fa672cc0a2207e0dd2938d15483c4', '90c2990bc7ea56d541f537adb40c3617');
var parse = require("parse/node").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF", "bctRQbnLCvxRIHaJTkv3gqhlwSzxjiMesjx8kEwo");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home',{});

    var phoneNumbers = req.query.phoneNumbers;
    var names = req.query.names;

    /*for (i = 0; i < phoneNumbers.length; i++) {
        sendInvite(phoneNumbers[i], names[i], req.query.hostname, req.query.eventName, req.query.code, req.query.eventDate);
    }*/

    //http://localhost:3000/invites?phoneNumbers=+16095027269&names=Dom&hostname=Dominic&eventName=Ya&code=hey-d_innovator&eventDate=3/27/17

    if (req.query.id != null){
        console.log("id not null");
        for (var i = 0; i < phoneNumbers.length; i++) {
            sendInvite(phoneNumbers[i], names[i], req.query.hostname, req.query.eventName, req.query.id, req.query.eventDate);
        }

    } else {
        console.log("id null");
        var Posts = parse.Object.extend('Event');
        var query = new parse.Query(Posts);
        // query.equalTo("code", eventCode);
        query.equalTo("code", req.query.code);
        query.first({
            success: function(object) {

                var objectId = object.id;
                for (var i = 0; i < phoneNumbers.length; i++) {
                    sendInvite(phoneNumbers[i], names[i], req.query.hostname, req.query.eventName, objectId, req.query.eventDate);
                }
            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    }
});

function sendInvite(phoneNumber, guestName, hostName, eventName, code, date) {
    client.sendMessage({

        to: phoneNumber, // Any number Twilio can deliver to
        from: '+18562194216 ', // A number you bought from Twilio and can use for outbound communication
        body: ' Hey ' + guestName + ', ' + hostName + ' invited you to ' + eventName + '! Get the details here: https://www.hiikey.com/events?id=' + code +
            '\n\n' + 'https://www.hiikey.com/app is the simplest way to organize & join secret events.'
        // body of the SMS message

    }, function(err, responseData) { //this function is executed when a response is received from Twilio

        if (!err) { // "err" is an error received during the request, if any

            // "responseData" is a JavaScript object containing data received from Twilio.
            // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
            // http://www.twilio.com/docs/api/rest/sending-sms#example-1

            console.log(responseData.from); // outputs "+14506667788"
            console.log(responseData.body); // outputs "word to your mother."

        }
    });
}


module.exports = router;