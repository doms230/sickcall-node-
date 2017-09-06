/**
 * Created by macmini on 8/12/16.
 * http://localhost:5000/notifications?userId=wcbsnOpMwH&message=Heyyeyyasdfasdf
 *    //depracted: see https://www.npmjs.com/org/sendgrid

 */

var express = require('express');
var router = express.Router();
var http = require('http');

//sendgrid stuff
//var helper = require('sendgrid').mail;
//var sg = require('sendgrid')('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');

//parse
var parse = require("parse/node").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF",
    "bctRQbnLCvxRIHaJTkv3gqhlwSzxjiMesjx8kEwo");

//twilio
var client = require('twilio')('AC847fa672cc0a2207e0dd2938d15483c4', '90c2990bc7ea56d541f537adb40c3617');
/* GET home page. */
router.get('/', function(req, res, next) {

    /*var User = parse.Object.extend("_User");
    var emailQuery = new parse.Query(User);
    emailQuery.get(user, {
        useMasterKey:true,
        success: function(object) {
            //   console.log(object);
            var userEmail = object.get('email');
            var username = object.get('username');
            var phoneNumber = object.get('phoneNumber');

            sendEmail(userEmail, message, eventId, username);
           // sendText(phoneNumber, message, eventId);

        },
        error: function(object, error) {
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
        }
    });*/

});

router.post('/send', function(req, res, next){
    var message = req.body.message;
    var user = req.body.userId;

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

});

function sendEmail(toEmail, notification, eventId, username){

    /*var from_email = new helper.Email('noreply@hiikey.com');
    var to_email = new helper.Email(toEmail);
    var subject = 'Hiikey Alert';
    var content = new helper.Content(
        'text/html', 'I\'m replacing the <strong>body tag</strong>');
    var mail = new helper.Mail(from_email, subject, to_email, content);
    mail.personalizations[0].addSubstitution(
        new helper.Substitution('-notification-', notification));
    mail.personalizations[0].addSubstitution(
        new helper.Substitution('-eventId-', eventId));
    mail.personalizations[0].addSubstitution(
        new helper.Substitution('-username-', username));
    mail.setTemplateId('332a0c9a-c948-4a7d-9bac-e69ef41f5714');

    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
    });

    sg.API(request, function(error, response) {
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
    });*/
}

function sendText(phoneNumber, message, eventId) {
    client.sendMessage({

        to: phoneNumber, // Any number Twilio can deliver to
        from: '+18562194216 ', // A number you bought from Twilio and can use for outbound communication
        body: "Hiikey alert: " + message + '\n\n' + 'Event link: ' + 'https://www.hiikey.com/events?id=' + eventId
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