#!/usr/bin/env node

var parse = require("parse/node").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF",
    "bctRQbnLCvxRIHaJTkv3gqhlwSzxjiMesjx8kEwo","lykNp62jc700RfU3EOr0WRe8ZCZJ4kiD4ZI4FRaZ");
var moment = require("moment");

var currentDate = new Date();
//TODO: Won't scale if people are posting more than 6000 videos an hour .. change
console.log("current date:" + currentDate);
/*var Posts = parse.Object.extend('Post');
var query = new parse.Query(Posts);
query.equalTo("isRemoved", false);
query.equalTo("isAnswered", false);
query.find({
    useMasterKey: true,
    success: function(results) {
        // Do something with the returned Parse.Object values
        for (var i = 0; i < results.length; i++) {
            var object = results[i];
            console.log(object.id + ' : ' + object.createdAt);

            //get post date
            var postDate = new Date(object.createdAt);

            // console.log(moment().diff(postDate,'hour'));
            var timeDifference = moment().diff(postDate,'minutes');
            console.log(timeDifference);
            /*if (timeDifference > 2 ){
                object.set("isRemoved", true);
                object.save();
            }
        }
    },
    error: function(error) {
        console.log("Error: " + error.code + " " + error.message);
    }
});*/