/**
 * Created by macmini on 2/1/17.
 *
 * TODO: was able to return user data.. now check the data connects
 */


var express = require('express');
var router = express.Router();
var moment = require("moment");
var momenttz = require('moment-timezone');
var jstz = require("jstz");
var parse = require("parse/node").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF", "bctRQbnLCvxRIHaJTkv3gqhlwSzxjiMesjx8kEwo");


//messages
var messages = [];
var createdAt = [];
var chatUserIds = [];
var chatUsernames = [];
var chatUserDisplayNames = [];
var chatImages = [];
var chatImageSRC = [];
var chatImageURL = [];

//events
var userId;
var title;

var startDate;
var startJaunt;

var endDate;
var endJaunt;

var description;
var imageURL;
var imageSRC;
var address;
var code;
var eventLocation;
var coordinates;

//user
var eventHost;

var isCurrentUser = false;

router.get('/', function (req, res, next) {

    //store the cookie
    //res.cookie("cookie" , 'jaja')

    //see about setting experation date for cookie

    //grab the cookie .. req.cookies.whateverThenNameOfTheSavedCookie
    // console.log("Cookies :  ", req.cookies.timezone);

    //var tz = jstz.determine();
    // console.log(tz.name());
    //console.log("timezone: " + date.timeZone);
    // console.log("utc date:" +  date.getUTCDate());

    var eventCode = req.query.id;

    loadEvent(res, eventCode, true);
    //checkSession(req, res);

});

router.post('/rsvp', function(req, res){

    //if user is signed in, rsvp ... else go to sign in /sign up
    res.send({redirect: '/logins'});

});

function loadEvent(res, eventCode){
    var Posts = parse.Object.extend('Event');
    var query = new parse.Query(Posts);
    query.equalTo("code", eventCode);
    query.equalTo("isRemoved", false);
    query.find({
        success: function(results) {

            // Do something with the returned Parse.Object values
            for (var i = 0; i < results.length; i++) {
                var object = results[i];

                //res.send(object);

                userId = object.get('userId');
                title = object.get('title');

                startDate = object.get('startTime');
                startJaunt = momenttz.tz(startDate, "America/Chicago").format("ddd, MMM Do YYYY, h:mm a");

                endDate = new Date(object.get('endTime'));
                endJaunt = momenttz.tz(endDate, "America/Chicago").format("ddd, MMM Do YYYY, h:mm a");

                description = object.get('description');
                imageURL = object.get('eventImage');
                imageSRC = (object.get("eventImage").name())[0].src;
                address = object.get('address');
                code = object.get('code');
                eventLocation = object.get('location');
                coordinates = eventLocation.latitude + "," + eventLocation.longitude;

                //maybe try to find current location
                /*if (object.id == "bOmzOucpQE") {
                 startDate = "Fri, Jan 27th 2017, 10:00 pm";
                 endDate = "Sat, Jan 28th 2017, 1:00 am";
                 }*/

                /*

                 // generate a string that only has the time portion
                 var strWithoutTimezone = moment(localEquivalent).format("YYYY-MM-DDTHH:mm:ss")
                 // extract out the site's timezone identifier (DateWithTimezone.getTimezone() stores the site's timezone)
                 var timezone = moment.tz(DateWithTimezone.getTimezone()).format("Z")
                 // create a moment in the site's timezone and use it to initialize a <span style="font-family: 'courier new', courier;">DateWithTimezone</span>
                 return new DateWithTimezone(moment(strWithoutTimezone + timezone))
                 */
                //load User
                //loadUser(res, userId, title, startJaunt, endJaunt, description, imageSRC, imageURL, address, eventCode, coordinates);

                loadUser(res, object.id );

            }
        },
        error: function(error) {
            //alert("Error: " + error.code + " " + error.message);
            res.send("Error: " + error.code + " " + error.message);
        }
    });
}

function loadUser(res, eventId){

    var User = parse.Object.extend("_User");
    var query = new parse.Query(User);
    query.get(userId, {
        success: function(object) {
            // The object was retrieved successfully.
            eventHost =  object.getUsername();
            loadMessages(res, eventId);
        },
        error: function(object, error) {
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
        }
    });
}

function loadMessages(res,eventId ){
    var Posts = parse.Object.extend('Chat');
    var query = new parse.Query(Posts);
    query.equalTo("eventId", eventId);
    query.find({
        success: function(results) {
            // Do something with the returned Parse.Object values
            for (var i = 0; i < results.length; i++) {
                var object = results[i];

                var createDate = new Date(object.createdAt);
                var createJaunt = momenttz.tz(createDate, "America/Chicago").format("ddd, MMM Do YYYY, h:mm a");

                messages[i] = object.get("message");
                createdAt[i] = createDate;
                chatUsernames[i] = "Dom Smith";
                //chatUserDisplayNames[i] = "Dom SMith";
                //chatImages = [];

                var userData = loadChatUser(object.get("userId"));

                chatUserDisplayNames[i] = userData.name;
                chatImageSRC[i] = userData.imageSRC;
              //  chatImageURL[i] = userData.imageURL;
            }

            var data = [];

            for (var index = 0; index < results.length; index ++ ){
                data.push({
                    message: messages[index],
                    createdAt: createJaunt[index],
                    name: chatUserDisplayNames[index],
                    image: chatImageSRC[index].name()[0].src = chatImageURL[index].url()
                });
            }

            console.log(data[0].image);
            //load event page
            res.render('message', {
                title: title,
                startDate: startJaunt,
                endDate: endJaunt,
                description: description,
                image: imageSRC = imageURL.url(),
                address: address,
                eventCode: code,
                user: eventHost,
                coordinates: coordinates,
                didRSVP: true,
                data: data
            });
        },
        error: function(error) {
            //alert("Error: " + error.code + " " + error.message);
            res.send("Error: " + error.code + " " + error.message);
        }
    });
}

    function loadChatUser(user){

       // var data = [];
    //load chat user
    var User = parse.Object.extend("_User");
    var query = new parse.Query(User);
    query.get(user, {
        success: function(object) {
            console.log(object);
            // The object was retrieved successfully.
            var username = object.getUsername();
            console.log(object.get('Profile').name());
           //var userImageURL = object.get('Profile');
           var userImageSRC = object.get("Profile");
            var data = [];
            data.push({
                imageSRC: userImageSRC,
                name: username
            });
            console.log(data);
            return data;
        },
        error: function(object, error) {
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
        }
    });
        //console.log(data);

}

function checkSession(req, res){
    if (req.session.token == undefined) {
        console.log('No session token');

    } else {
        console.log('Query for session token' + req.session.token);
        Parse.Cloud.useMasterKey();

        var sq = new parse.Query('_Session')
            .equalTo('sessionToken', req.session.token)
            .include('user');

        sq.first().then(function(sessionResult) {
            if (sessionResult == undefined) {
                console.log("No matching session");
                // res.redirect('/account/pub/login');
            } else {
                console.log("Got matching session");
                req.user = sessionResult.get('user');
                res.locals.session = req.session;
                res.locals.user = req.user;
                console.log(sessionResult.get('user'));
            }
        }, function(err) {
            console.log("Error or no matching session: " + err);
        });
    }
}

module.exports = router;