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
var parse = require("parse/node").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF", "bctRQbnLCvxRIHaJTkv3gqhlwSzxjiMesjx8kEwo");

//twitter login

var isCurrentUser = false;

    router.get('/', function (req, res, next) {

        var eventCode = req.query.id;
        //loadEvent(res, eventCode, true);

        res.render('event', {objectId: eventCode});

    });

function loadEvent(res, eventCode){
    var Posts = parse.Object.extend('Event');
    var query = new parse.Query(Posts);
   // query.equalTo("code", eventCode);
    query.equalTo("objectId", eventCode);
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


            }
        },
        error: function(error) {
            //alert("Error: " + error.code + " " + error.message);
            res.send("Error: " + error.code + " " + error.message);
        }
    });
}


module.exports = router;