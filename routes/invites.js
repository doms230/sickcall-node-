/**
 * Created by d_innovator on 1/13/17.
 */


var express = require('express');
var router = express.Router();
var http = require('http');

var client = require('twilio')('AC847fa672cc0a2207e0dd2938d15483c4', '90c2990bc7ea56d541f537adb40c3617');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home',{});

    client.sendMessage({

        to: req.query.phone_number, // Any number Twilio can deliver to
        from: '+18562194216 ', // A number you bought from Twilio and can use for outbound communication
        body: req.query.message // body of the SMS message

    }, function(err, responseData) { //this function is executed when a response is received from Twilio

        if (!err) { // "err" is an error received during the request, if any

            // "responseData" is a JavaScript object containing data received from Twilio.
            // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
            // http://www.twilio.com/docs/api/rest/sending-sms#example-1

            console.log(responseData.from); // outputs "+14506667788"
            console.log(responseData.body); // outputs "word to your mother."

        }
    });
});

module.exports = router;