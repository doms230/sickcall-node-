/**
 * Created by macmini on 3/17/17.
 */


var parse = require("parse").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF"); parse.serverURL = 'https://hiikey.herokuapp.com/parse';
var currentUser = parse.User.current();

var moment = require("moment");

//                             <li class="active"><a href="#">Home</a></li>
//<li><a href="#">Features</a></li>
//<li><a href="#">Contact</a></li>

//watchify public/javascripts/searchScripts.js -o public/javascripts/searchBundle.js -v

$(function(){



    $('#searchButton').click(function(){
        $('#noEventsGroup').hide();
       // $('#welcomeGroup').hide();
        var searchValue =  document.getElementById('searchValue').value;
        //alert(searchValue);
        geoCode(searchValue);
    });

    $('#closeEventsButton').click(function(){
        $('#noEventsGroup').hide();

       // $('#welcomeGroup').hide();
        if (navigator.geolocation) {
            $('#progress').show();
            navigator.geolocation.getCurrentPosition(showPosition);

        } else {
            $('#welcomeGroup').show();
        }
    });

    $('#noEventsButton').click(function(){
        $('#noEventsGroup').hide();
        if (navigator.geolocation) {
            $('#progress').show();
            navigator.geolocation.getCurrentPosition(showPosition);

        } else {
            $('#welcomeGroup').show();
        }
    });

    if (currentUser){
        $("#navBar").append(' <li role="presentation"> <a href="/home"><span class="  glyphicon glyphicon-home" aria-hidden="true"></a>' +
            '</li>' +

            '<li  class="active" role="presentation"><a href="/search"><span class="  glyphicon glyphicon-search" aria-hidden="true"></span></a>' +
            '</li>' +

            '<li role="presentation"><a href="/create"><span class="  glyphicon glyphicon-plus" aria-hidden="true"></span></a>' +
            '</li>' +

            '<li role="presentation"><a href="/profile"><span class=" glyphicon glyphicon-user" aria-hidden="true"></span></a>' +
            '</li>'  );

    } else {
        $('#navBar').append('<a class="navbar-brand" href="/about">' +

            '</a>' + '<p class=" navbar-text">  <a class="learnMore" href="/logins" class="navbar-link">Sign In / Sign Up</a></p>');
    }

    /*if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }*/
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
    query.withinMiles("location",point, 50);
    query.ascending("startTime");
    query.find({
        success: function(results) {
            // Do something with the returned Parse.Object values

            if(results.length == 0){
                $('#noEventsGroup').show();
            }
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

                $('#progress').hide();
                //$('#searchGroup').show();

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
                    window.location.href = "https://www.hiikey.com/events?id=" + $(this).attr("id") ;
                    //alert($(this).attr("id"));
                });
            }
        },
        error: function(error) {
            //alert("Error: " + error.code + " " + error.message);
            //res.send("Error: " + error.code + " " + error.message);
        }
    });




    function findEvent(eventCode){
        var Posts = parse.Object.extend('Event');
        var query = new parse.Query(Posts);
        query.equalTo("code", eventCode);
        query.find({
            success: function(results) {
                // Do something with the returned Parse.Object values
                if (results.length > 0){
                   //alert('ya');
                    for (var i = 0; i < results.length; i++) {

                        var objectId = object.id;

                        window.location.href = "https://www.hiikey.com/events?id=" + objectId ;
                    }
                } else {
                    //show dismissable alert above event div
                    alert('nah');
                }

            },
            error: function(error) {
                //alert("Error: " + error.code + " " + error.message);
                //res.send("Error: " + error.code + " " + error.message);
            }
        });
    }
}

function geoCode(searchValue) {
    var key = 'AIzaSyDL1MYUxhB8a5yfIB4B0X3VISgS-Kw3IcA';
    var url = "https://maps.googleapis.com/maps/api/geocode/json";

    var myNode = document.getElementById("eventdiv");
     while (myNode.firstChild) {
     myNode.removeChild(myNode.firstChild);

     }

    $.ajax({
        url : url,
        type : 'GET',
        data : {
            key: key,
            address : searchValue,
            sensor : false
        },
        async : false,
        success : function(result) {

            try {
                //position.lat = result.results[0].geometry.location.lat;
                //position.lng = result.results[0].geometry.location.lng;
                //alert(result.results[0].geometry.location.lat);
                var point = new parse.GeoPoint({latitude: result.results[0].geometry.location.lat , longitude: result.results[0].geometry.location.lng});
                loadEventInfo(point);
            } catch(err) {
                alert(err);
            }
        }
    });
    //return position;
}