/**
 * Created by d_innovator on 2/28/17.
 */

var parse = require("parse").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF"); parse.serverURL = 'http://localhost:3000/parse';
var currentUser = parse.User.current();

$(function(){

    loadEventInfo()

});

function loadEventInfo(){
    var Posts = parse.Object.extend('Event');
    var query = new parse.Query(Posts);
    query.equalTo("userId", "M3fUHRH1TQ");
    query.find({
        success: function(results) {
            // Do something with the returned Parse.Object values
            for (var i = 0; i < results.length; i++) {
                var object = results[i];

                eventId = object.id;

                var startDate = new Date(object.get("startTime"));
                var endDate = new Date(object.get("endTime"));
                //TODO: Change this
                //var createJaunt = momenttz.tz(createDate, "America/Chicago").format("ddd, MMM Do YYYY, h:mm a");
                eventTitle = object.get('title');
                var image = (object.get("eventImage").name())[0].src = object.get("eventImage").url();
                var code = object.get("code");
                var description = object.get("description");
                eventHostId = object.get("userId");
                loadEventUser(eventHostId,eventTitle,image,code,description,startDate,endDate);

                address = object.get("address");
                var eventLocation = object.get('location');
                coordinates = eventLocation.latitude + "," + eventLocation.longitude;
                var invites = object.get('invites');

                configureUser(invites);

            }
        },
        error: function(error) {
            //alert("Error: " + error.code + " " + error.message);
            //res.send("Error: " + error.code + " " + error.message);
        }
    });
}