/**
 * Created by macmini on 4/7/16.
 * testevent-d_innovator
 */
var express = require('express');
var router = express.Router();
var moment = require("moment");

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

                    title = object.get('title');
                    var startDate = object.get('startTime');


                    var endDate = object.get('endTime');
                    // var d = new Date(date.getDate());
                    address = object.get('address');

                    var eventCode = object.get('code');

                    res.render('event', {
                        title: title,
                        startDate:moment( new Date(startDate)).format("ddd, MMM Do YYYY, h:mm a"),
                        endDate: moment( new Date(endDate)).format("ddd, MMM Do YYYY, h:mm a") ,
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