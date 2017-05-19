/**
 * Created by d_innovator on 2/12/17.
 * git
 * watchify public/javascripts/eventScripts.js -o public/javascripts/bundle.js -v
 *
 * change login so that modal shows
 *
 */

//signinDiv
var parse = require("parse").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF"); parse.serverURL = 'https://hiikey.herokuapp.com/parse';
var moment = require("moment");

var currentUser = parse.User.current();
var showShowMessageBar = false;
var didRSVP = false;
var eventId;
var eventHostId;
var eventTitle;
var isInvited = false;
var address;
var coordinates;
var invites;
var description;
var startDate;
var endDate;
var startTime;
var endTime;
var eventImage;
var eventLocation;

//used to notify users who RSVP'd to event
//see loadRSVPS() and removeEventAction()
var eventGuestIds = [];

//date and time need to be split up so making values specifically for editing event.
var editStartDate;
var editStartTime;
var editEndDate;
var editEndTime;

var newEventImage;

var errorMessage;

//new user stuff
var verifiedNumber = "";
var parseFile;
var newUserId;
var loginErrorMessage;

//used to determine whether or not profile pic is being uploaded
var isUpdatingProfile = false;

//var currentUser = true;
$(function(){
   // $('#rsvpButton').hide();
    // alert(currentUser.id);
    //var x = document.getElementById('objectId').value
   // var y = $('#objectId').html();

    //var url = href.match('/id=(.+)/')[1];

    var url = window.location.toString();
    var ya = url.split("=");

    //document.getElementById("badgeJaunt").innerHTML = "23";
    //
   loadEventInfo(ya[1]);

    $('#rsvpButton').click(function () {
        if (currentUser){
            var NewRSVP = parse.Object.extend("RSVP");
            var rsvp = new NewRSVP();
            rsvp.set("eventId", eventId);
            rsvp.set("userId", currentUser.id);
            rsvp.set("eventHostId", eventHostId);
            rsvp.set("eventTitle", eventTitle);
            rsvp.set("isSubscribed", true);
            rsvp.set("isConfirmed", isInvited);
            rsvp.set("isRemoved", false);
            rsvp.set("isBlocked", false);
            rsvp.save(null, {
                success: function(gameScore) {
                    if (isInvited){
                        $('#rsvpButton').hide();
                        loadLocation();
                        configureMessages();
                        loadRSVPs();

                        sendNotification(eventHostId, currentUser.get('username') + "joined your " + eventTitle + " guest list.");

                    } else {
                        $('#rsvpButton').hide();
                        $('#alertDiv').append('<div class="alert alert-info" role="alert">RSVP Pending</div>');
                        $('#alertDiv').show();

                        sendNotification(eventHostId, currentUser.get('username') + " requested access to " + eventTitle + ".");
                    }
                },
                error: function(gameScore, error) {
                    // Execute any logic that should take place if the save fails.
                    // error is a Parse.Error with an error code and message.
                    alert('Failed to create new object, with error code: ' + error.message);
                }
            });

        } else {
            //$("#signinDiv").show();
            // window.location.href = "https://www.hiikey.com/logins?e=" + ya[1] ;
            //window.location.href = "http://localhost:3000/logins?e=" + ya[1] ;

            $('#registerModal').modal('show');
        }
    });

    $('#sendmsg').click(function (e) {
        var message =  document.getElementById('usermsg').value;
        //TODO: send notification
        var New = parse.Object.extend("Chat");
        var newMessage = new New();
        newMessage.set("message", message);
        newMessage.set("userId", currentUser.id);
        newMessage.set("eventId", eventId);
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

    $('#messages').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
       // $('#locationDiv').hide();
        $('#rsvpDiv').hide();
        $('#messageDiv').show();
        if (showShowMessageBar){
            $('#messageBarDiv').show();
        }
    });

    $('#rsvps').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
     //   $('#locationDiv').hide();
        $('#messageDiv').hide();
        $('#messageBarDiv').hide();
        $('#rsvpDiv').show();
    });

   /* $('#navSignInButton').submit(function(e){
        var username =  document.getElementById('navEmail').value;
        var password =  document.getElementById('navPassword').value;

        parse.User.logIn(username, password, {
            success: function(user) {
                //TODO: change this
                //window.location.href = "https://www.hiikey.com/events?id=" + eventId;
                window.location.href = "http://localhost:3000/events?id=" + eventId;

            },
            error: function(user, error) {
                alert(error);
            }
        });
    });*/

    //check to se if user is logged in

    //update event
    $('#updateEvent').click(function(){

        var Event = parse.Object.extend("Event");
        var query = new parse.Query(Event);
        query.get(eventId, {
            success: function(object) {

                var editTitle = document.getElementById('inputTitle').value;
                var editAddress = document.getElementById('inputAddress').value;

                var startDate = document.getElementById('inputStartDate').value;
                var startTime = document.getElementById('inputStartTime').value;
                var startJaunt = new Date(startDate + "," + startTime);

                var endDate = document.getElementById('inputEndDate').value;
                var endTime = document.getElementById('inputEndTime').value;
                var endJaunt = new Date(endDate + "," + endTime);

                if (validateDetails(editTitle, startDate, startTime, startJaunt, endDate, endTime, endJaunt, editAddress)){

                    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" +
                        editAddress +
                        "&key=" +
                        "AIzaSyAdnr849aDFzuYIJBTqyzdapF_7aR8AikI";

                    eventLocation =  geocodeAddress(url);
                    object.set('location', eventLocation);

                    if (newEventImage != null){
                        object.set("eventImage", newEventImage);
                    }

                    object.set('title', editTitle);
                    object.set('address',editAddress);
                    object.set('description',document.getElementById('inputDescription').value);
                    object.set('endTime', endJaunt);
                    object.set('startTime', startJaunt);
                    object.save(null, {
                        success: function(object) {
                            window.location.href = "https://www.hiikey.com/events?id=" + eventId;
                           // window.location.href = "http://localhost:3000/events?id=" + eventId;
                        }
                    });

                } else {
                    alert(errorMessage);
                }

                //document.getElementById('image').src
            },
            error: function(object, error) {
                // The object was not retrieved successfully.
                // error is a Parse.Error with an error code and message.
                alert(error);
            }
        });
    });

    $(":file").change(function () {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = imageIsLoaded;
            reader.readAsDataURL(this.files[0]);
        }
    });

    //sign in/ sign up jaunts
    $('#signinAction').click(function () {
        var username =  document.getElementById('inputUsername').value;
        var password =  document.getElementById('inputPassword').value;

        parse.User.logIn(username, password, {
            success: function(user) {
                if (user.id == eventHostId){
                    window.location.href = "https://www.hiikey.com/events?id=" + eventId;

                } else {
                    var phoneNumber = user.get("phoneNumber");

                    for (var o = 0; o < invites.length; o++){
                        if (invites[o] == phoneNumber){
                            isInvited = true;
                            // alert(isInvited);
                        }
                    }

                    checkSignInRSVP(user.id, user.get('username'));
                }
            },
            error: function(user, error) {
                alert(error);
            }
        });
    });
});

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

    if(validateSignup(username, password)){
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
                isUpdatingProfile = true;
                $('#registerModal').modal('hide');
                $('#profileModal').modal('show');

                newUserId = user.id;
            },
            error: function(user, error) {
                // Show the error message somewhere and let the user try again.
                alert("Error: " + error.message);
            }
        });

    } else {
        alert(loginErrorMessage);
    }
});

$('#forgotPasswordAction').click(function () {
    var emailJaunt = document.getElementById('forgotpasswordEmail').value;
    parse.User.requestPasswordReset(emailJaunt, {
        success: function() {
            $('#registerModal').modal('hide');
            alert('Check for an email from noreply@hiikey.com for password reset instructions.');
        },
        error: function(error) {
            alert("We couldn't find an account associated with " + emailJaunt );
        }
    });
});

$('#navForgotPasswordAction').click(function () {
    var emailJaunt = document.getElementById('navForgotpasswordEmail').value;
    parse.User.requestPasswordReset(emailJaunt, {
        success: function() {
            $('#registerModal').modal('hide');
            alert('Check for an email from noreply@hiikey.com for password reset instructions.');
        },
        error: function(error) {
            alert("We couldn't find an account associated with " + emailJaunt );
        }
    });
});

$('#removeEventAction').click(function () {
    var GameScore = parse.Object.extend("Event");
    var query = new parse.Query(GameScore);
    query.get(eventId, {
        success: function(gameScore) {
            gameScore.set("isRemoved", true);
            gameScore.save().then(function() {

                window.location.href = "https://www.hiikey.com/home";

                for (var i=0; i<eventGuestIds.length; i++){
                    sendNotification(eventGuestIds[i], currentUser.get('username') + " canceled " + eventTitle + ".");
                }
                // sendNotification(userId, currentUser.get('username') + "added you to the " + eventTitle + " guest list.");
            }, function(error) {
                // The file either could not be read, or could not be saved to Parse.
                 alert(error);
            });
        },
        error: function(object, error) {
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
        }
    });
});

/**Profile ish here  **/
$('#digits-sdk').load(function () {
    // Initialize Digits using the API key.
    Digits.init({ consumerKey: 'IeV33K1YaqjI4ompRDHiDREH3' })
        .done(function() {
            console.log('Digits initialized.');
        })
        .fail(function() {
            console.log('Digits failed to initialize.');
        });

    // Set a click event listener on the Digits button.
    $('#inputNumber').click(onLoginButtonClick);
});

$('#updateInfo').click(function () {
    var User = parse.Object.extend("_User");
    var query = new parse.Query(User);
    query.get(newUserId, {
        success: function(object) {

            object.set("DisplayName", document.getElementById('inputName').value);
            // var image = (object.get("Profile").name())[0].src = object.get("Profile").url();
            object.set("phoneNumber", document.getElementById('inputNumber').value);
            object.set("Profile", parseFile);
            object.set("phoneNumber", verifiedNumber);
            object.save();

            newRSVP(newUserId, object.get('username'));
        },
        error: function(object, error) {
            newRSVP(newUserId, object.get('username'));
        }
    });
});

$('#signinButton').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
    $('#forgotpassword').hide();
    $('#signup').hide();
    $('#signin').show();
});

$('#signupButton').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
    $('#forgotpassword').hide();
    $('#signin').hide();
    $('#signup').show();
});

$('#forgotPasswordButton').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
    $('#signin').hide();
    $('#signup').hide();
    $('#forgotpassword').show();
});

//event info
function loadEventInfo(objectId){
    var Posts = parse.Object.extend('Event');
    var query = new parse.Query(Posts);
    query.equalTo("objectId", objectId);
    query.find({
        success: function(results) {
            // Do something with the returned Parse.Object values
            for (var i = 0; i < results.length; i++) {
                var object = results[i];

                eventId = object.id;

                //var startDate = new Date(object.get("startTime"));
                startDate = moment(new Date(object.get("startTime"))).format("ddd, MMM Do YYYY, h:mm a");
                endDate = moment(new Date(object.get("endTime"))).format("ddd, MMM Do YYYY, h:mm a");

                editStartDate = moment(new Date(object.get("startTime"))).format("M/D/YY");
                editStartTime = moment(new Date(object.get("startTime"))).format("h:mm a");
                editEndDate = moment(new Date(object.get("endTime"))).format("M/D/YY");
                editEndTime = moment(new Date(object.get("endTime"))).format("h:mm a");

                //var createJaunt = momenttz.tz(createDate, "America/Chicago").format("ddd, MMM Do YYYY, h:mm a");
                eventTitle = object.get('title');
                eventImage = (object.get("eventImage").name())[0].src = object.get("eventImage").url();
                var code = object.get("code");
                description = object.get("description");
                eventHostId = object.get("userId");

                address = object.get("address");
                var eventLocation = object.get('location');
                coordinates = eventLocation.latitude + "," + eventLocation.longitude;
                invites = object.get('invites');

                loadEventUser(eventHostId,eventTitle,eventImage,code,description,startDate,endDate);

                if(currentUser){
                    if (eventHostId == currentUser.id){
                        loadNavBar(true);
                        showRequests();

                    } else {
                        loadNavBar(false);
                    }

                } else {
                    loadNavBar(false);
                }
            }
        },
        error: function(error) {
            //alert("Error: " + error.code + " " + error.message);
            //res.send("Error: " + error.code + " " + error.message);
        }
    });
}

function loadEventUser(userId, title, image, code, description, startDate, endDate ){
    var User = parse.Object.extend("_User");
    var query = new parse.Query(User);
    query.get(userId, {
        success: function(object) {
            //console.log(object);
            // The object was retrieved successfully.
            var displayName = object.get("username");

            if (object.get("Profile") != null){
                var userImage = (object.get("Profile").name())[0].src = object.get("Profile").url();
            }

            $('#flyerDiv').hide();

            $('#eventInfoDiv').append(
                '<h1>' + title + '</h1>' +
               // '<h4>' + displayName + '- <small>' + description + '</small></h4>' +
                '<h4> Date - <small>' + startDate +  ' - ' +  endDate + '</small></h4>' +
                '<a class="thumbnail">' +
                '<img alt="..." src=' + image + '>' +
                '</a>' +
                '<h4>event code: <span class="label label-danger">' + code + '</span> </h4> '+
                '<nav aria-label="...">'+
                '<ul class="pager">'+
                '<li><a href="app" >Open in App</a></li>'+
            '</ul>'+
            '</nav>');

            //append event host description
            appendMessage(displayName, " ", description, userImage);
            $('#messageDiv').show();

            //then configure current user stuff
            if (currentUser){
                configureUser(invites);
            } else {
                //$("#signinDiv").show();
                $('#rsvpButton').show();
            }
        },
        error: function(object, error) {
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
        }
    });
    //console.log(data);
}
//location

function loadLocation(){
    var coordinate = "//www.google.com/maps/embed/v1/place?q=" + coordinates + "&zoom=17" +
        "&key=AIzaSyAdnr849aDFzuYIJBTqyzdapF_7aR8AikI";

    $('#locationDiv').append('<div class="container-fluid">' +

        '<h4>' + address + '</h4>' +

        '<iframe src=' + coordinate + '></iframe>' +

        '</div>' );
    $('#locationDiv').show();
}

//messages

function configureMessages(){
    $('#messageBarDiv').show();
    showShowMessageBar = true;
    var Posts = parse.Object.extend('Chat');
    var query = new parse.Query(Posts);
    query.equalTo("eventId", eventId);
    query.descending("createdAt");
    query.find({
        success: function(results) {
            // Do something with the returned Parse.Object values
            for (var i = 0; i < results.length; i++) {
                var object = results[i];

                //TODO: Change this
                var createDate = moment(new Date(object.createdAt)).format("ddd, MMM Do YYYY, h:mm a");
                //var createJaunt = momenttz.tz(createDate, "America/Chicago").format("ddd, MMM Do YYYY, h:mm a");
                var message = object.get("message");
                var userId = object.get("userId");

                loadUserInfo(userId,createDate,message,true);
            }
        },
        error: function(error) {
            //alert("Error: " + error.code + " " + error.message);
            console.log("Error: " + error.code + " " + error.message);
        }
    });

   // var query = new parse.Query('Chat');
    //query.equalTo("eventId", "0mrEjZt6I7");
    var subscription = query.subscribe();

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
    var Posts = parse.Object.extend('RSVP');
    var query = new parse.Query(Posts);
    query.equalTo("eventId", eventId);
    query.equalTo("isConfirmed", true);
    query.descending("createdAt");
    query.find({
        success: function(results) {
            if (results.length == 0){
                $('#rsvpDiv').append(
                    '<div class="alert alert-info" role="alert">No Guests Yet</div>'
                )

            } else {
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];

                    var userId = object.get("userId");
                    eventGuestIds[i] = userId;
                    loadUserInfo(userId,"","",false);
                }
            }
        },
        error: function(error) {
            //alert("Error: " + error.code + " " + error.message);
            res.send("Error: " + error.code + " " + error.message);
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

function configureUser(invites) {
    var User = parse.Object.extend("_User");
    var query = new parse.Query(User);
    query.get(currentUser.id, {
        success: function(object) {
            //console.log(object);
            // The object was retrieved successfully.
            var username = object.getUsername();
            var displayName = object.get("DisplayName");
            var image = (object.get("Profile").name())[0].src = object.get("Profile").url();
            var number = object.get("phoneNumber");

            /*$('#userInfo').append(
                '<div class="media-left">' +
                '<img class="img-circle" alt="..." width="25" height="25" src=' + image + '>' +
                '</div>' +
                '<div class="media-body">' +
                '<h4 class="media-heading">' + displayName + '<small>' + username + '</small> </h4>' +

                '</div>'); */
            //alert(invites.length);
            for (var i = 0; i <= invites.length; i++) {
                if (invites[i] == number){
                    isInvited = true;
                }
            }

            if (eventHostId == currentUser.id){
                loadLocation();
                configureMessages();
                loadRSVPs();
               // $('#messageBarDiv').show();

            } else {
                checkRSVP();
            }
        },
        error: function(object, error) {
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
        }
    });
}

function checkRSVP(){
    var Posts = parse.Object.extend('RSVP');
    var query = new parse.Query(Posts);
    query.equalTo("eventId", eventId);
    query.equalTo("userId", currentUser.id);
    query.find({
        success: function(results) {
            // Do something with the returned Parse.Object values
            //alert(results.length);
            for (var i = 0; i <= results.length; i++) {
                var object = results[i];
                //alert(results.length);
                //
                if (results.length > 0){
                   // alert("hey");

                     if (object.get("isBlocked")){
                        //add jaunt that says user has been blocked
                        $('#alertDiv').append('<div class="alert alert-danger" role="alert">You\'re blocked from this event.</div>');
                        $('#alertDiv').show();
                    } else if (object.get("isConfirmed")){

                        loadLocation();
                        configureMessages();
                        loadRSVPs();

                    } else {
                        $('#alertDiv').append('<div class="alert alert-info" role="alert">RSVP Pending</div>');
                        $('#alertDiv').show();
                    }
                } else {
                    $('#rsvpButton').show();
                }
            }
        },
        error: function(error) {
            //alert("error");
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

//host Stuff

function loadNavBar(isHost){

    if(!currentUser){
        $('#navbar').append(
                '<form class="navbar-form navbar-right">' +
                    '<div class="form-group">' +
                '<input id="navEmail" type="text" placeholder="Email" class="form-control">' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<input id="navPassword" type="password" placeholder="Password" class="form-control">' +
                    '</div>' +
                '<button id="navSignInButton" class="btn btn-default">Sign In</button>' +
                '<a id="navForgotPassword" >  Forgot Password</a>' +
        '</form>'
    );

        $('#navSignInButton').click(function (e) {
            var username =  document.getElementById('navEmail').value;
            var password =  document.getElementById('navPassword').value;

            parse.User.logIn(username, password, {
                success: function(user) {
                    //TODO: change this
                    window.location.href = "https://www.hiikey.com/events?id=" + eventId;
                   // window.location.href = "http://localhost:3000/events?id=" + eventId;

                },
                error: function(user, error) {
                    alert(error);
                }
            });
        });

        $('#navForgotPassword').click(function (e) {
            $('#navForgotPasswordModal').modal('show');
        });

    } else if (isHost){
        $("#navbar").append('<ul   class="nav navbar-nav">'+
            '<li> <a href="home">Home</a></li>'+
            '<li><a href="search">Search</a></li>' +
            ' <li><a href="create">Create Event</a></li>' +
            '<li><a href="profile">Profile</a></li>' +
            '<li><hr class="featurette-divider"></li>' +
            '<li><a  id="removeEvent" >Remove Event</a></li>' +
            '<li><a  id="editEvent" >Edit Event</a></li>' +
            '<li><a id="eventRequests" >Requests <span id="badgeJaunt" class="badge">0</span></a></li>' +
            '</ul>');

        /*$('#editEvent').click(function () {

        });*/

        $('#eventRequests').click(function(){
            $('#modelRequests').modal('show');
        });

        $('#editEvent').click(function(){
            document.getElementById('inputTitle').value = eventTitle;
            document.getElementById('inputAddress').value = address;
            document.getElementById('inputDescription').value = description;
            document.getElementById('inputStartDate').value = editStartDate;
            document.getElementById('inputStartTime').value = editStartTime;
            document.getElementById('inputEndDate').value = editEndDate;
            document.getElementById('inputEndTime').value = editEndTime;
            document.getElementById('inputImage').src = eventImage;
            $('#modalEdit').modal('show');
        });

        $('#removeEvent').click(function(){

            $('#removeEventModal').modal('show');
        });

    } else {
        $("#navbar").append('<ul   class="nav navbar-nav">'+
            '<li> <a href="home">Home</a></li>'+
            '<li><a href="search">Search</a></li>' +
            '<li><a href="create">Create Event</a></li>' +
            '<li><a href="profile">Profile</a></li>');
    }
}

function showRequests(){
    var objectId;
    var object;
    var allResults;

    //used for badge count updage for requests tab
    var resultCount;

    var Posts = parse.Object.extend('RSVP');
    var rQuery = new parse.Query(Posts);
    rQuery.equalTo("eventId", eventId);
    rQuery.equalTo("isConfirmed", false);
    rQuery.descending("createdAt");
    rQuery.find({
        success: function(results) {
            allResults = results;
            resultCount = results.length;

            //show the number of requests on menu
            //document.getElementById('badgeJaunt').value = results.length;
            $('#badgeJaunt').html(results.length);

            //show the people who requested access
            for (var i = 0; i < results.length; i++) {
                object = results[i];

                objectId =  object.id;

               /* $('#requestBody').append(
                    '<div class="media" id=' + 'media' + objectId +  '>' +
                    '<div class="media-left">' +
                    '<a href="#">' +
                    '<img class="img-circle" alt="..." width="50" height="50" src= /images/logo.png >' +
                    '</a>' +
                    '</div>' +
                    '<div class="media-body">' +
                    '<h4 class="media-heading"> Dom' + i + '</h4>' +
                    '<h5 class="media-heading">@ </h5>' +
                    '</div>' +
                    '<div class="media-right">' +
                    '<button type="button" class="btn btn-default astericks" id=' + objectId  + ' >Accept</button>' +
                    '</div>' +
                    '</div>'
                );

                $("#" + objectId).click(function(){
                    console.log($(this).attr("id"));

                    /* object.set('isConfirmed', true);
                     object.save().then(function() {
                     //TODO: send notifcation that person is given access.
                     //  sendNotification(object.get("userId"), currentUser.username + "added you to the" + eventTitle + "guest list.");
                     }, function(error) {
                     // The file either could not be read, or could not be saved to Parse.
                     // alert(error);
                     });

                    // $('#badgeJaunt').html(results.length - 1);
                    // $('#media' + objectId).hide();

                });*/

                var User = parse.Object.extend("_User");
                var uQuery = new parse.Query(User);
                uQuery.get(object.get('userId'), {
                    success: function(uObject) {
                        //console.log(object);
                        // The object was retrieved successfully.
                        var rUsername= uObject.getUsername();
                        var rName  = uObject.get("DisplayName");

                        var rImage = (uObject.get("Profile").name())[0].src = uObject.get("Profile").url();

                        $('#requestBody').append(
                            '<div class="media" id=' + 'media' + uObject.id +  '>' +
                            '<div class="media-left">' +
                            '<a href="#">' +
                            '<img class="img-circle" alt="..." width="50" height="50" src=' + rImage + '>' +
                            '</a>' +
                            '</div>' +
                            '<div class="media-body">' +
                            '<h4 class="media-heading">' + rName + '</h4>' +
                            '<h5 class="media-heading">@' + rUsername + '</h5>' +
                            '</div>' +
                            '<div class="media-right">' +
                            '<button type="button" class="btn btn-default astericks" id=' + uObject.id  + ' >Accept</button>' +
                            '</div>' +
                            '</div>'
                        );

                        $("#" + uObject.id).click(function(){
                            //console.log(allResults.length);
                            var userId = $(this).attr("id");
                            var rsvpObjectId;
                            //using user id as identifier because eventId wasn't working while in user query object.
                            //doing for loop to get the Id of object row

                            for (var o = 0; o < allResults.length; o++){
                                //console.log('rsvp ObjectId: ' + allResults[o].get('userId'));

                                if (userId == allResults[o].get('userId')){
                                    rsvpObjectId = allResults[o];

                                    rsvpObjectId.set('isConfirmed', true);
                                    rsvpObjectId.save().then(function() {
                                    //    console.log('did that');
                                        //TODO: send notifcation that person is given access.
                                        sendNotification(userId, currentUser.get('username') + " added you to the " + eventTitle + " guest list.");
                                    }, function(error) {
                                        // The file either could not be read, or could not be saved to Parse.
                                        // alert(error);
                                    });

                                    resultCount = resultCount - 1;
                                    $('#badgeJaunt').html(resultCount);
                                    $('#media' + uObject.id).hide();
                                }
                            }
                        });
                    },
                    error: function(object, error) {
                        // The object was not retrieved successfully.
                        // error is a Parse.Error with an error code and message.
                    }
                });
            }
        },
        error: function(error) {
            //alert("Error: " + error.code + " " + error.message);
            res.send("Error: " + error.code + " " + error.message);
        }
    });
}

function imageIsLoaded(e) {
    $('#inputImage').attr('src', e.target.result);
    $('#profileImage').attr('src', e.target.result);

    var fileUploadControl = $("#editEventImage")[0];
    var fileUploadControl1 = $("#newProfilePhoto")[0];

    if(isUpdatingProfile){
        var file1 = fileUploadControl1.files[0];
        var name1 = "photo.jpg";

        parseFile = new parse.File(name1, file1);
        parseFile.save().then(function() {
            // The file has been saved to Parse.
            //alert("worked");
        }, function(error) {
            // The file either could not be read, or could not be saved to Parse.
            alert(error);
        });
        isUpdatingProfile = false;

    } else {
        var file = fileUploadControl.files[0];
        var name = "photo.jpg";

        newEventImage = new parse.File(name, file);
        newEventImage.save().then(function() {
            // The file has been saved to Parse.
            //alert("worked");
        }, function(error) {
            // The file either could not be read, or could not be saved to Parse.
            alert(error);
        });
    }
    // document.getElementById('image').src = e.target.result
}

function validateDetails(title, startDate, startTime, startJaunt, endDate, endTime, endJaunt, address){

    if (title == ""){
        errorMessage = "Title is required, make it good!";
        return false;
    }

    if (address == ""){
        errorMessage = "Address is required.";
        return false;
    }

    if (startDate == "" ){
        errorMessage = "Start Date is required.";
        return false;

    } else if (startTime == ""){
        errorMessage = "Start Time is required.";
        return false;

    } else if (endDate == ""){
        errorMessage = "End Date is required.";
        return false;

    } else if (endTime == ""){
        errorMessage = "End Time is required. ";
        return false;

    } else if (startJaunt > endJaunt){
        errorMessage = "Oops, the start date occurs after the end date";
        return false;
    }

    return true;
}

function validateSignup(username, email){
    if (username == ""){
        loginErrorMessage = "username required";
        return false;
    }

    if (email == ""){
        loginErrorMessage = "email required";
        return false;

    }

    return true;
}

function geocodeAddress(url){

    var lat;
    var lng;

    $.ajax({
        url : url,
        type : 'GET',
        data : {

        },
        async : false,
        success : function(result) {

            try {
                //alert(result);

                /*for (var i = 0; i < result.results.length; i++) {
                 var lat = result.results[i].geometry.location.lat;
                 var long = result.results[i].geometry.location.lng;
                 alert(myAddress);

                 }*/
                //alert(result.results[0].geometry.location.lat);
                lat = result.results[0].geometry.location.lat;
                lng = result.results[0].geometry.location.lng;
                //alert(result.results[0].geometry.location.lat);

                //alert();


            } catch(err) {
                alert(err);
            }
        }
    });

    return new parse.GeoPoint({latitude: lat, longitude: lng});
}

//rsvp stuff

function checkSignInRSVP(user, username){
    var Posts = parse.Object.extend('RSVP');
    var query = new parse.Query(Posts);
    query.equalTo("eventId", eventId);
    query.equalTo("userId", user);
    query.find({
        success: function(results) {
            if (results.length == 0){
                newRSVP(user, username);

            } else {
                //TODO:uncomment
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

function newRSVP(user, username){
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
                sendNotification(eventHostId, username + " joined your" + eventTitle + "guest list.");

            } else {
                sendNotification(eventHostId, username + " requested access to " + eventTitle + ".");
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

//phone number stuff
/**
 * Launch the Digits login flow.
 */
function onLoginButtonClick(event) {
    console.log('Digits login started.');
    Digits.logIn().done(onLogin).fail(onLoginFailure);
}

/**
 * Handle the login once the user has completed the sign in with Digits.
 * We must POST these headers to the server to safely invoke the Digits API
 * and get the logged-in user's data.
 */

function parseOAuthHeaders(oAuthEchoHeaders) {
    var credentials = oAuthEchoHeaders['X-Verify-Credentials-Authorization'];
    var apiUrl = oAuthEchoHeaders['X-Auth-Service-Provider'];

    return {
        apiUrl: apiUrl,
        credentials: credentials
    };
}

function onLogin(loginResponse) {
    console.log('Digits login succeeded.');
    //alert(loginResponse);
    var oAuthHeaders = parseOAuthHeaders(loginResponse.oauth_echo_headers);

    //setDigitsButton('Signing In…');
    $.ajax({
        type: 'POST',
        url: 'https://www.hiikey.com/digits/digits',
        data: oAuthHeaders,
        success: onDigitsSuccess
    });
}

/**
 * Handle the login failure.
 */
function onLoginFailure(loginResponse) {
    console.log('Digits login failed.');
    alert(loginResponse);
    document.getElementById('inputNumber').value = " ";
    verifiedNumber = " ";
}

/**
 * Handle the login once the user has completed the sign in with Digits.
 * We must POST these headers to the server to safely invoke the Digits API
 * and get the logged-in user's data.
 */
function onDigitsSuccess(response) {
    console.log('Digits phone number retrieved.');
    //setDigitsNumber(response.phoneNumber);
    verifiedNumber = response.phoneNumber;
    document.getElementById('inputNumber').value = response.phoneNumber;

}

