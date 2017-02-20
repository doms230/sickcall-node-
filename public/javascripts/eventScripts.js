/**
 * Created by d_innovator on 2/12/17.
 * watchify public/javascripts/eventScripts.js -o public/javascripts/bundle.js -v

 */

//signinDiv
var parse = require("parse").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF"); parse.serverURL = 'http://192.168.1.67:3000/parse';
var currentUser = parse.User.current();
//var currentUser = true;
$(function(){
    //load event info
    loadLocation();
    loadMessages();
    configureNewMessage();
    loadRSVPs();

    //check to se if user is logged in
    if (currentUser) {
        $('#locationDiv').show();
    } else {
        configureUser();
        $('#signinDiv').show() 
    }
});

//location

function loadLocation(){
    //TODO: put actual data here
    $('#locationDiv').append('<div class="container-fluid">' +

        '<h4>Location - <small>1210 S Lamar St</small> </h4>' +

        '<iframe src="//www.google.com/maps/embed/v1/place?q=32.7787196880853,-96.7693720605207' +
        '&zoom=17' +
        '&key=AIzaSyAdnr849aDFzuYIJBTqyzdapF_7aR8AikI">' +
        '</iframe>' +

        '</div>' );

    $('#location').click(function (e) {
        e.preventDefault();
        $(this).tab('show');

        if (currentUser){
            $('#rsvpDiv').hide();
            $('#messageDiv').hide();
            $('#messageBarDiv').hide();
            $('#locationDiv').show();
        }
    });
}

//messages

function configureNewMessage() {
    $('#sendmsg').click(function (e) {
        var message =  document.getElementById('usermsg').value;

        //TODO: replace eventId with actual one
        var New = parse.Object.extend("Chat");
        var newMessage = new New();
        newMessage.set("message", message);
        newMessage.set("userId", "wcbsnOpMwH");
        newMessage.set("eventId", "0mrEjZt6I7");
        newMessage.save(null, {
            success: function (object) {
                // Execute any logic that should take place after the object is saved.
                document.getElementById('usermsg').value = "";
            },
            error: function (gameScore, error) {
                // Execute any logic that should take place if the save fails.
                // error is a Parse.Error with an error code and message.

            }
        });
    });
}

function loadMessages(){
    //TODO: load proper event id
    var Posts = parse.Object.extend('Chat');
    var query = new parse.Query(Posts);
    query.equalTo("eventId", "0mrEjZt6I7");
    query.descending("createdAt");
    query.find({
        success: function(results) {
            // Do something with the returned Parse.Object values
            for (var i = 0; i < results.length; i++) {
                var object = results[i];

                var createDate = new Date(object.createdAt);
                //TODO: Change this 
                //var createJaunt = momenttz.tz(createDate, "America/Chicago").format("ddd, MMM Do YYYY, h:mm a");
                var message = object.get("message");
                var userId = object.get("userId");

                loadUserInfo(userId,createDate,message,true);
            }
        },
        error: function(error) {
            //alert("Error: " + error.code + " " + error.message);
            res.send("Error: " + error.code + " " + error.message);
        }
    });

    $('#messages').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        if (currentUser){
            $('#locationDiv').hide();
            $('#rsvpDiv').hide();
            $('#messageDiv').show();
            $('#messageBarDiv').show();
        }
    });

    var query = new parse.Query('Chat');
    query.equalTo("eventId", "0mrEjZt6I7");
    var subscription = query.subscribe();

    /*subscription.on('open', () => {
        //console.log('subscription opened');
       // alert("sub opened");
    });*/

    subscription.on('create', (object) => {
        //console.log('object created: ' + object.get('message'));
        //alert('object created: ' + object.get('message'))
        var createDate = new Date(object.createdAt);
        //TODO: Change this
        //var createJaunt = momenttz.tz(createDate, "America/Chicago").format("ddd, MMM Do YYYY, h:mm a");
        var message = object.get("message");
        var userId = object.get("userId");

        loadUserInfo(userId,createDate,message,true);

    });
}

function appendMessage(name, date, message, image) {
    $('#messageDiv').append( '<div class="container-fluid">' +
        '<div class="media">' +
        '<div class="media-left">' +
        '<img class="img-circle" src=' + image + ' alt="..." width="64" height="64" >' +
        '</div>' +
        '<div class="media-body">' +
        '<h4 class="media-heading">' + name + '<small>' + date + '</small></h4>' +
        message +
        '</div>' +
        '</div>' +
        '</br>' +
        '</div>' );
}

//rsvp

function loadRSVPs(){
    //TODO: load proper event id
    var Posts = parse.Object.extend('RSVP');
    var query = new parse.Query(Posts);
    query.equalTo("eventId", "0mrEjZt6I7");
    query.equalTo("isConfirmed", true);
    query.descending("createdAt");
    query.find({
        success: function(results) {
            // Do something with the returned Parse.Object values
            for (var i = 0; i < results.length; i++) {
                var object = results[i];

                var userId = object.get("userId");
                loadUserInfo(userId,"","",false);
            }
        },
        error: function(error) {
            //alert("Error: " + error.code + " " + error.message);
            res.send("Error: " + error.code + " " + error.message);
        }
    });

    $('#rsvps').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        if (currentUser){
            $('#locationDiv').hide();
            $('#messageDiv').hide();
            $('#messageBarDiv').hide();
            $('#rsvpDiv').show();
        }
    });
}

function appendRSVP(image, username, displayName) {
    $('#rsvpDiv').append(
        '<div class="container-fluid">' +
        '<div class="media">' +
        '<div class="media-left">' +
        '<img class="img-circle" src=' + image + ' alt="..." width="64" height="64" >' +
        '</div>' +
        '<div class="media-body">' +
        '<h4 class="media-heading">' + username + '</h4>' +
        displayName +
        '</div>' +
        '</div>' +
        '</br>' +
        '</div>');
}

//user

function loadUserInfo(userId, date, message, isChat){
    var User = parse.Object.extend("_User");
    var query = new parse.Query(User);
    query.get(userId, {
        success: function(object) {
            //console.log(object);
            // The object was retrieved successfully.
            var username = object.getUsername();
            var displayName = object.get("DisplayName");
            var image = (object.get("Profile").name())[0].src = object.get("Profile").url();

            if (isChat){
                appendMessage(username, date, message, image);

            } else {
                //appendRSVP
                appendRSVP(image,username,displayName);
            }

        },
        error: function(object, error) {
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
        }
    });
    //console.log(data);
}

function configureUser() {
    $('#signin').click(function (e) {
        var username =  document.getElementById('inputUsername').value;
        var password =  document.getElementById('inputPassword').value;

        parse.User.logIn(username, password, {
            success: function(user) {
                console.log(user);
                $('#signinDiv').hide();
                $('#locationDiv').show();
            },
            error: function(user, error) {
                // The login failed. Check error to see why.
                console.log(error);
            }
        });
    });
}


