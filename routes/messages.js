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
//var $ = require("jquery");
var jsdom = require('jsdom');

var document = jsdom.jsdom('<html></html>');
var window = document.defaultView;
var $ = require('jquery')(window);

//messages
var messages;
var createdAt;
var chatUsernames;
var userData;

//events
var userId;
var title;
var eventId;

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

//chat char


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

    //intialized chat variables here because if person
    //page will freeze at load chat user .. see if userData.length == length
    messages = [];
    createdAt = [];
    chatUsernames = [];
    userData = [];

    loadEvent(res, eventCode, true);


   /* $("#sendmsg").click(function () {
        $.post("messages/newMessage",
            {
                userId: "wcbsnOpMwH",
                message: "adgasgfa"
            },
            function(data, status){
                //alert("Data: " + data + "\nStatus: " + status);
                //window.location.href = data.redirect;
                //document.getElementById('usermsg').value = "";
            });
    });*/

    //checkSession(req, res);

    /*var query = new Parse.Query('Chat');
    //query.equalTo('userId', 'PGAJ3hxM7X');
    var subscription = query.subscribe();

    subscription.on('open', () => {
        alert("sub opened");
    });

    subscription.on('create', (object) => {
        // console.log('object created: ' + object.get('message'));
        alert('object created: ' + object.get('message'))
    });*/

});

router.post('/newMessage', function(req, res){

     var New = parse.Object.extend("Chat");
     var newMessage = new New();

     newMessage.set("message", req.body.message);
     newMessage.set("userId", req.body.userId);
     newMessage.set("eventId", eventId);
     newMessage.save(null, {
     success: function (object) {
     // Execute any logic that should take place after the object is saved.
     res.send(object);
     },
     error: function (gameScore, error) {
     // Execute any logic that should take place if the save fails.
     // error is a Parse.Error with an error code and message.
     res.send(error);
     }
     });

    // Get message pushed
    /* var query = new Parse.Query('Messages');
     //query.equalTo('sendUser', currentUser.get("username"));
     $.subscription = query.subscribe();

     $.subscription.on('open', function(){
     console.log('subscription opened');
     });

     $.subscription.on('create', function(message){
     appendResults([message]);

     console.log(message.get('message')); // This should output Mengyan
     });*/

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
                eventId = object.id;

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

function loadMessages(){
    var Posts = parse.Object.extend('Chat');
    var query = new parse.Query(Posts);
    query.equalTo("eventId", "0mrEjZt6I7");
    query.descending("createdAt");
    query.find({
        success: function(results) {
            // Do something with the returned Parse.Object values
            for (var i = 0; i < results.length; i++) {
                var object = results[i];

                var createDate = new Date(object.createdAt);
                var createJaunt = momenttz.tz(createDate, "America/Chicago").format("ddd, MMM Do YYYY, h:mm a");

                messages[i] = object.get("message");
                createdAt[i] = createJaunt;
                chatUsernames[i] = "Dom Smith";

                loadChatUser(object.get("userId"), i, results.length, res);
            }
        },
        error: function(error) {
            //alert("Error: " + error.code + " " + error.message);
            res.send("Error: " + error.code + " " + error.message);
        }
    });
}

    function loadChatUser(user, i,length, res){

       // var data = [];
    //load chat user
    var User = parse.Object.extend("_User");
    var query = new parse.Query(User);
    query.get(user, {
        success: function(object) {
            //console.log(object);
            // The object was retrieved successfully.
            var username = object.getUsername();

            userData.push({
                message: messages[i],
                createdAt: createdAt[i],
                image: (object.get("Profile").name())[0].src = object.get("Profile").url(),
                name: username
            });

            console.log("User data lenfth: " + userData.length);
            if (userData.length == length){
                res.render('message', {
                    id: eventId,
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
                    data: userData
                });

                /*var query = new Parse.Query('Chat');
                //query.equalTo('userId', 'PGAJ3hxM7X');
                var subscription = query.subscribe();

                subscription.on('open', () => {
                    console.log('subscription opened');
                    console("sub opened");
                });

                subscription.on('create', (object) => {
                    console.log('object created: ' + object.get('message'));
                    console('object created: ' + object.get('message'))
                });*/
            }
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