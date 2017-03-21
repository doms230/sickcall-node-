/**
 * Created by macmini on 3/17/17.
 */


var parse = require("parse").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF"); parse.serverURL = 'http://192.168.1.66:3000/parse';
var currentUser = parse.User.current();

var moment = require("moment");

//watchify public/javascripts/searchScripts.js -o public/javascripts/searchBundle.js -v


$(function(){
    if (currentUser){
        $("#navBar").append(    '<a class="navbar-brand" href="/about">' +
            '<img alt="Hiikey">' +
        '</a>' +
        '<div class="container-fluid">' +
            '<ul class="nav nav-pills">'+

               ' <li role="presentation"> <a href="/home"><span class="  glyphicon glyphicon-home" aria-hidden="true"></span></a>' +
                '</li>' +

               ' <li role="presentation"><a href="/search"><span class="  glyphicon glyphicon-search" aria-hidden="true"></span></a>' +
                '</li>' +

                '<li role="presentation"><a href="/create"><span class="  glyphicon glyphicon-plus" aria-hidden="true"></span></a>' +
                '</li>' +

                '<li role="presentation"><a href="/profile"><span class=" glyphicon glyphicon-user" aria-hidden="true"></span></a>' +
                '</li>' +
            '</ul>' +
        '</div>' );

    } else {
        $('#navBar').append('<p class=" navbar-text"> <a href="/logins" class="navbar-link">Sign In / Sign Up</a></p>');
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
});

function showPosition(position) {
    //alert( position.coords.latitude + "," +  position.coords.longitude );
    var point = new parse.GeoPoint({latitude: position.coords.latitude , longitude: position.coords.longitude});
    loadEventInfo(point);
}

function loadEventInfo(point){

    var date = new Date();

    var Posts = parse.Object.extend('Event');
    var query = new parse.Query(Posts);
    query.equalTo("isRemoved", false);
    query.greaterThan("endTime", date);
    query.near("location", point);
    query.ascending("startTime");
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
                //alert(code);
                var description = object.get("description");

                var startTime =  new Date(object.get("startTime"));
                var date = moment(startTime).format("ddd, MMM Do YYYY, h:mm a");

                var objectId = object.id;

                $('#eventdiv').append( '<div class="page-header" id=' + objectId + ' >' +
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
                    window.location.href = "http://localhost:3000/events?id=" + $(this).attr("id") ;
                    //alert($(this).attr("id"));
                });
            }
        },
        error: function(error) {
            //alert("Error: " + error.code + " " + error.message);
            //res.send("Error: " + error.code + " " + error.message);
        }
    });
}