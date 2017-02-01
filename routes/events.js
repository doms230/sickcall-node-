/**
 * Created by macmini on 4/7/16.
 * testevent-d_innovator
 *
 * Cookies are just stored data.. Can be used for when user logs in... store UserId or some shit to be loaded later
 * example: https://www.codementor.io/nodejs/tutorial/cookie-management-in-express-js
 *TODO: convert utc time to whatever timezone the event creator is in
 *
 * check to see if current user... may not save automatically so might have to save session token as cookie
 * If not current user, show RSVP button
 * if current user, but DID NOT RSVP, show RSVP button
 * if current user, but DID RSVP, show location 
 *
 *
 */
var express = require('express');
var router = express.Router();
var moment = require("moment");
var momenttz = require('moment-timezone');
var jstz = require("jstz");
var parse = require("parse/node").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF", "bctRQbnLCvxRIHaJTkv3gqhlwSzxjiMesjx8kEwo");

//twitter login

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

    router.get('/messages', function(req, res){
        res.render('eventCode',{});

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

                var userId = object.get('userId');
                var title = object.get('title');

                var startDate = object.get('startTime');
                var startJaunt = momenttz.tz(startDate, "America/Chicago").format("ddd, MMM Do YYYY, h:mm a");

                var endDate = new Date(object.get('endTime'));
                var endJaunt = momenttz.tz(endDate, "America/Chicago").format("ddd, MMM Do YYYY, h:mm a");

                var description = object.get('description');
                var imageURL = object.get('eventImage');
                var imageSRC = (object.get("eventImage").name())[0].src;
                var address = object.get('address');
                var eventCode = object.get('code');
                var eventLocation = object.get('location');
                var coordinates = eventLocation.latitude + "," + eventLocation.longitude;

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

                var currentUser = parse.User.current();
                if (currentUser) {
                    // do stuff with the user
                    console.log("signed in");
                    loadUser(res, userId, title, startJaunt, endJaunt, description, imageSRC, imageURL, address, eventCode, coordinates, true );

                } else {
                    isCurrentUser = false;
                    // show the signup or login page
                    console.log("not signed in");
                    loadUser(res, userId, title, startJaunt, endJaunt, description, imageSRC, imageURL, address, eventCode, coordinates, false);
                }
            }
        },
        error: function(error) {
            //alert("Error: " + error.code + " " + error.message);
            res.send("Error: " + error.code + " " + error.message);
        }
    });
}

function loadUser(res, userId, title, startJaunt, endJaunt, description, imageSRC, imageURL, address, eventCode, coordinates, isCurrentUser){

    var User = parse.Object.extend("_User");
    var query = new parse.Query(User);
    query.get(userId, {
        success: function(object) {
            // The object was retrieved successfully.
           var eventHost =  object.getUsername();

            //load event page
            res.render('event', {
                title: title,
                startDate: startJaunt,
                endDate: endJaunt,
                description: description,
                image: imageSRC = imageURL.url(),
                address: address,
                eventCode: eventCode,
                user: eventHost,
                coordinates: coordinates,
                didRSVP: true
            });
        },
        error: function(object, error) {
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
        }
    });
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