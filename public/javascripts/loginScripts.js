/**
 * Created by macmini on 3/20/17.
 *
 * watchify public/javascripts/loginScripts.js -o public/javascripts/loginBundle.js -v
 */

var parse = require("parse").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF"); parse.serverURL = 'https://hiikey.herokuapp.com/parse';

var parseFile;
var url;
var eventId;
var currentUser = parse.User.current();

var eventTitle;
var eventHostId;
var invites;
var isInvited = false;

$(function(){

    url = window.location.toString();
    var ya = url.split("e=");
    eventId = ya[1];
    if (currentUser){
        window.location.href = "https://www.hiikey.com/profile";

    } else {
        loadEventInfo(eventId);
    }

    base64encode('/images/logo.png', function (base64Img) {
        var simge = base64Img.split(',');
        simge = simge[1];
        parseFile = new parse.File("webImage.png", {"base64": simge});
        parseFile.save().then(function() {
            // The file has been saved to Parse.
            //alert("worked");
        }, function(error) {
            // The file either could not be read, or could not be saved to Parse.
            alert(error);
        });
    });

    $('#signupAction').click(function () {
        var username =  document.getElementById('signupUsername').value;
        var password =  document.getElementById('signupPassword').value;
        var email = document.getElementById('signupEmail').value;

        var user = new parse.User();
        user.set("username", username);
        user.set("password", password);
        user.set("email", email);
        user.set("DisplayName", username );
        user.set("Profile", parseFile);
        user.set("phoneNumber", "");
        user.set("twitter", "");
        user.set("facebook", "");

        user.signUp(null, {
            success: function(user) {
                var href = window.location.href;
                if (!href.toString().includes("?e=")){
                    window.location.href = "https://www.hiikey.com/profile" ;

                } else {
                   // alert(ya[1]);
                    //loadEventInfo(ya[1]);
                    window.location.href = "https://www.hiikey.com/profile?e=" + eventId ;
                    //window.location.href = "http://localhost:3000/profile?e=" + eventId ;
                }
            },
            error: function(user, error) {
                // Show the error message somewhere and let the user try again.
                alert("Error: " + error.message);
            }
        });
    });

    $('#signinAction').click(function () {

        var username =  document.getElementById('inputUsername').value;
        var password =  document.getElementById('inputPassword').value;

        parse.User.logIn(username, password, {
            success: function(user) {

                var href = window.location.href;

                if (!href.toString().includes("?e=")){
                     window.location.href = "https://www.hiikey.com/profile" ;
                    //window.location.href = "localhost:3000/events?id=6mTJ5j1TYE"

                } else {
                    var phoneNumber = user.get("phoneNumber");

                    for (var o = 0; o < invites.length; o++){
                        if (invites[o] == phoneNumber){
                            isInvited = true;
                           // alert(isInvited);
                        }
                    }

                    checkRSVP(user.id);
                }
            },
            error: function(user, error) {
                alert(error);
            }
        });
    });

    $('#signinButton').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
       // alert("asdf");
        $('#signup').hide();
        $('#signin').show();
    });

    $('#signupButton').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        $('#signin').hide();
        $('#signup').show();
    });

    //check to se if user is logged in

});

//process local file
function base64encode(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
            callback(reader.result);
        };
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.send();
}

function checkRSVP(user){
    var Posts = parse.Object.extend('RSVP');
    var query = new parse.Query(Posts);
    query.equalTo("eventId", eventId);
    query.equalTo("userId", user);
    query.find({
        success: function(results) {
            if (results.length == 0){
                newRSVP(user);

            } else {
                 window.location.href = "https://www.hiikey.com/events?id=" + eventId ;
               // window.location.href = "http://localhost:3000/events?id=" + eventId ;
            }
        },
        error: function(error) {
            //alert("error");
            //alert("Error: " + error.code + " " + error.message);
            //res.send("Error: " + error.code + " " + error.message);
        }
    });
}

function newRSVP(user){
    var NewRSVP = parse.Object.extend("RSVP");
    var rsvp = new NewRSVP();
    rsvp.set("eventId", eventId);
    rsvp.set("userId", user);
    rsvp.set("eventHostId", eventHostId);
    rsvp.set("eventTitle", eventTitle);
    rsvp.set("isSubscribed", true);
    rsvp.set("isConfirmed", isInvited);
    rsvp.set("isRemoved", false);
    rsvp.set("isBlocked", false);
    rsvp.save(null, {
        success: function(gameScore) {
            if (isInvited){
                 sendNotification(eventHostId, currentUser.username + "joined your" + eventTitle + "guest list.");

            } else {
                  sendNotification(eventHostId, currentUser.username + "requested access to " + eventTitle + ".");
            }

             window.location.href = "https://www.hiikey.com/events?id=" + eventId ;
           // window.location.href = "http://localhost:3000/events?id=" + eventId ;
        },
        error: function(gameScore, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            alert('Failed to create new RSVP: ' + error.message);
        }
    });
}

function loadEventInfo(objectId){
    var Posts = parse.Object.extend('Event');
    var query = new parse.Query(Posts);
    query.equalTo("objectId", objectId);
    query.find({
        success: function(results) {
            // Do something with the returned Parse.Object values
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                //eventId = object.id;
                eventTitle = object.get('title');
                eventHostId = object.get("userId");
                invites = object.get("invites");
            }
        },
        error: function(error) {
            //alert("Error: " + error.code + " " + error.message);
            //res.send("Error: " + error.code + " " + error.message);
        }
    });
}

function sendNotification(userId, message){
    $.ajax({
        url : "https://hiikey.herokuapp.com/notifications",
        type : 'GET',
        data : {
            userId: userId,
            message : message
        },
        async : false,
        success : function(result) {

            try {
                //position.lat = result.results[0].geometry.location.lat;
                //position.lng = result.results[0].geometry.location.lng;
                //alert(result.results[0].geometry.location.lat);

            } catch(err) {
                alert(err);
            }
        }
    });
}