/**
 * Created by macmini on 3/25/17.
 *
 * watchify public/javascripts/userScripts.js -o public/javascripts/userBundle.js -v
 */

var parse = require("parse").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF"); parse.serverURL = 'https://hiikey.herokuapp.com/parse';
var currentUser = parse.User.current();

var rsvps = [];

var moment = require("moment");

$(function(){

    var url = window.location.pathname.toString();
    var ya = url.split("/");
    //alert();

    var Posts = parse.Object.extend('_User');
    var query = new parse.Query(Posts);
    // query.equalTo("code", eventCode);
    query.equalTo("username", ya[2]);
    query.first({
        success: function(object) {

            var objectId = object.id;
            loadEventInfo(objectId, true);
            loadRSVPS(objectId);
        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });

    $('#host').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        // $('#locationDiv').hide();
        $('#guestdiv').hide();
        $('#hostdiv').show();
    });

    $('#guest').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        //   $('#locationDiv').hide();
        $('#hostdiv').hide();
        $('#guestdiv').show();
    });
});

function loadRSVPS(user){
    var Posts = parse.Object.extend('RSVP');
    var query = new parse.Query(Posts);
    query.equalTo("userId", user);
    query.equalTo("isRemoved", false);
    query.find({
        success: function(results) {
            // Do something with the returned Parse.Object values
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                rsvps[i] =  object.get("eventId");
            }
            loadEventInfo(user, false);
        },
        error: function(error) {
            //alert("Error: " + error.code + " " + error.message);
            //res.send("Error: " + error.code + " " + error.message);
        }
    });
}

function loadEventInfo(user, isHost){
    var Posts = parse.Object.extend('Event');
    var query = new parse.Query(Posts);
    query.equalTo("isRemoved", false);

    if (isHost){
        query.equalTo("userId", user);

    } else {
        query.containedIn("objectId", rsvps);

    }

    query.find({
        success: function(results) {
            // Do something with the returned Parse.Object values

            if (results == 0){
                if (isHost){
                    $('#hostdiv').append(
                        '</br> <div class="alert alert-info" role="alert">No Events Yet</div>'
                    )
                } else {
                    $('#guestdiv').append(
                        '</br> <div class="alert alert-info" role="alert">No Events Yet</div>'
                    )
                }

            } else {
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
                    var startTime =  new Date(object.get("startTime"));
                    var date = moment(startTime).format("ddd, MMM Do YYYY, h:mm a");

                    var objectId = object.id;

                    if (isHost){
                        $('#hostdiv').append( '<div class="page-header" id=' + objectId + ' >' +
                            '<div class="media">' +
                            '<div class="media-left">' +
                            '<img class="img-rounded" src=' + image + ' alt="..." width="100" height="150" >' +
                            '</div>' +
                            '<div class="media-body">' +
                            '<h4 class="media-heading">' + eventTitle + '<small>' + '' + date + '</small></h4>' +
                            description +
                            '</div>' +
                            '</div>' +
                            '</br>' +
                            '</div>' );

                        $("#" + objectId).click(function(){
                            window.location.href = "https://hiikey.herokuapp.com/events?id=" + $(this).attr("id") ;
                            // alert($(this).attr("id"));
                        });

                    } else {
                        $('#guestdiv').append( '<div class="page-header" id=' + objectId + ' >' +
                            '<div class="media">' +
                            '<div class="media-left">' +
                            '<img class="img-rounded" src=' + image + ' alt="..." width="100" height="150" >' +
                            '</div>' +
                            '<div class="media-body">' +
                            '<h4 class="media-heading">' + eventTitle + '<small>' + '' + date + '</small></h4>' +
                            description +
                            '</div>' +
                            '</div>' +
                            '</br>' +
                            '</div>' );

                        $("#" + objectId).click(function(){
                            window.location.href = "https://hiikey.herokuapp.com/events?id=" + $(this).attr("id") ;
                            // alert($(this).attr("id"));
                        });
                    }
                }
            }
        },
        error: function(error) {
            //alert("Error: " + error.code + " " + error.message);
            //res.send("Error: " + error.code + " " + error.message);
        }
    });
}