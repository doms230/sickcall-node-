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

                    var yoma = object.get('eventImage');

                    eventUser = object.get("userId");
                    description = object.get('description');

                    var currentDate = new Date();
                    console.log(currentDate.getTimezoneOffset());
                    console.log(moment.tz.guess());
                    title = object.get('title');
                    var startDate = object.get('startTime');


                    var startJaunt = momenttz.tz(startDate, moment.tz.guess()).format("ddd, MMM Do YYYY, h:mm a");
                    console.log(startJaunt);


                    var endDate = new Date(object.get('endTime'));
                    // var d = new Date(date.getDate());
                    address = object.get('address');

                    var eventCode = object.get('code');

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
                        endDate: moment(endDate).format("ddd, MMM Do YYYY, h:mm a") ,
                        description: description,
                        image: (object.get("eventImage").name())[0].src = yoma.url(),
                        address: address,
                        eventCode: eventCode
                        //user: name,
                    });
                }
            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
    });

module.exports = router;