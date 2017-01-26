/**
 * Created by macmini on 4/7/16.
 * testevent-d_innovator
 *
 * Cookies are just stored data.. Can be used for when user logs in... store UserId or some shit to be loaded later
 * example: https://www.codementor.io/nodejs/tutorial/cookie-management-in-express-js
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

    router.get('/', function (req, res, next) {

        var date = new Date();
        console.log( "date: " + date.utcOffset);
        //store the cookie
       // res.cookie("cookie" , 'jaja')

        //see about setting experation date for cookie

        //grab the cookie .. req.cookies.whateverThenNameOfTheSavedCookie
       // console.log("Cookies :  ", req.cookies.timezone);

        //var tz = jstz.determine();
       // console.log(tz.name());
        //console.log("timezone: " + date.timeZone);
       // console.log("utc date:" +  date.getUTCDate());

        var eventCode = req.query.id;

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
                    loadUser(res, userId, title, startJaunt, endJaunt, description, imageSRC, imageURL, address, eventCode);
                }
            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    });

function loadUser(res, userId, title, startJaunt, endJaunt, description, imageSRC, imageURL, address, eventCode){
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
                user: eventHost
            });
        },
        error: function(object, error) {
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
        }
    });
}

module.exports = router;