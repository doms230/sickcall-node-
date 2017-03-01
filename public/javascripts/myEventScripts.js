/**
 * Created by d_innovator on 2/28/17.
 */

var parse = require("parse").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF"); parse.serverURL = 'http://localhost:3000/parse';
var currentUser = parse.User.current();

var rsvps = [];

$(function(){

    loadRSVPS(); 

});

function loadRSVPS(){
    var Posts = parse.Object.extend('RSVP');
    var query = new parse.Query(Posts);
    query.equalTo("userId", "wcbsnOpMwH");
    query.find({
        success: function(results) {
            // Do something with the returned Parse.Object values
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                rsvps[i] =  object.get("eventId");
            }
            loadEventInfo(rsvps); 
        },
        error: function(error) {
            //alert("Error: " + error.code + " " + error.message);
            //res.send("Error: " + error.code + " " + error.message);
        }
    });
}

function loadEventInfo(rsvps){
    var Posts = parse.Object.extend('Event');
    var query = new parse.Query(Posts);
    query.equalTo("userId", "wcbsnOpMwH");
   // query.containedIn("objectId", rsvps);
    
    query.find({
        success: function(results) {
            // Do something with the returned Parse.Object values
            for (var i = 0; i < results.length; i++) {
                var object = results[i];

                //var startDate = new Date(object.get("startTime"));
                //var endDate = new Date(object.get("endTime"));
                //TODO: Change this
                //var createJaunt = momenttz.tz(createDate, "America/Chicago").format("ddd, MMM Do YYYY, h:mm a");
                var eventTitle = object.get('title');
                var image = (object.get("eventImage").name())[0].src = object.get("eventImage").url();
                var code = object.get("code");
                var description = object.get("description");
                var date =  new Date(object.get("startTime"));

                $('#eventdiv').append( '<div class="page-header">' +
                    '<div class="media">' +
                    '<div class="media-left">' +
                    '<img class="img-rounded" src=' + image + ' alt="..." width="100" height="150" >' +
                    '</div>' +
                    '<div class="media-body">' +
                    '<h4 class="media-heading">' + eventTitle + '<small>' + date + '</small></h4>' +
                    description +
                    '</div>' +
                    '</div>' +
                    '</br>' +
                    '</div>' );

            }
        },
        error: function(error) {
            //alert("Error: " + error.code + " " + error.message);
            //res.send("Error: " + error.code + " " + error.message);
        }
    });
}