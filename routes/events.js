/**
 * Created by macmini on 4/7/16.
 * testevent-d_innovator
 */
var express = require('express');
var router = express.Router();
var moment = require("moment");
var momenttz = require('moment-timezone');
var parse = require("parse/node").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF", "bctRQbnLCvxRIHaJTkv3gqhlwSzxjiMesjx8kEwo");

//event Jaunts
var title;
var date;
var description;
var image;
var address;
var eventUser;
var eventHost;
var eventCode;
var startDate;
var endDate;
var yoma;
//twitter login

    router.get('/', function (req, res, next) {
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

                    yoma = object.get('eventImage');

                    eventUser = object.get("userId");
                    description = object.get('description');

                    title = object.get('title');
                    startDate = object.get('startTime');

                    var startJaunt = momenttz.tz(startDate, "America/Chicago").format("ddd, MMM Do YYYY, h:mm a");

                    endDate = new Date(object.get('endTime'));
                    var endJaunt = momenttz.tz(endDate, "America/Chicago").format("ddd, MMM Do YYYY, h:mm a");

                    address = object.get('address');

                    eventCode = object.get('code');

                    //maybe try to find current location
                    /*if (object.id == "bOmzOucpQE") {
                        startDate = "Fri, Jan 27th 2017, 10:00 pm";
                        endDate = "Sat, Jan 28th 2017, 1:00 am";
                    }*/

                    var userId = object.get('userId');

                    if (userId == "oB1igd9hLP"){
                        eventHost = "thegirlwhoroars";

                    } else {
                        eventHost = "bikergangbooking";
                    }

                    /*

                     // generate a string that only has the time portion
                     var strWithoutTimezone = moment(localEquivalent).format("YYYY-MM-DDTHH:mm:ss")
                     // extract out the site's timezone identifier (DateWithTimezone.getTimezone() stores the site's timezone)
                     var timezone = moment.tz(DateWithTimezone.getTimezone()).format("Z")
                     // create a moment in the site's timezone and use it to initialize a <span style="font-family: 'courier new', courier;">DateWithTimezone</span>
                     return new DateWithTimezone(moment(strWithoutTimezone + timezone))
                     */

                    res.render('event', {
                        title: title,
                        startDate: startJaunt,
                        endDate: endJaunt ,
                        description: description,
                        image: (object.get("eventImage").name())[0].src = yoma.url(),
                        address: address,
                        eventCode: eventCode,
                        user: eventHost
                        //user: name,
                    });

                    //loadUser(res)
                }
            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    });


function loadUser(res){
    var userId = object.get("userId");

     var userQuery = parse.Object.extend("_User");
     var query = new parse.Query(userQuery);
     query.get(userId, {
     success: function(object) {
     console.log("h" + object.get("DisplayName"));
     // The object was retrieved successfully.
     //var name = object.get("DisplayName");

     //check to see if user chose a name for their profile
      if (name == " "){
     eventHost = object.get("username");

     } else {
     eventHost = name;
     }

     //eventHost = object.get("username");

    res.send(eventHost);

     },
     error: function(object, error) {
     // The object was not retrieved successfully.
     // error is a Parse.Error with an error code and message.
     res.send(error);
     }
     });
}

module.exports = router;