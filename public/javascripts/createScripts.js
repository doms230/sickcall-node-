/**
 * Created by macmini on 5/7/17.
 *
 *  watchify public/javascripts/createScripts.js -o public/javascripts/createBundle.js -v

 */

//TODO: get rid of space in between title for event code
//TODO: do validation test to make sure address is found .. check lat lng values. 0,0 shouldn't be valid
    //TODO: change menu if user isn't logged in

var parse = require("parse").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF"); parse.serverURL = 'https://hiikey.herokuapp.com/parse';
var currentUser = parse.User.current();
var moment = require('moment');
var verifiedNumber = "";

var eventImage;
var errorMessage;

var endTime;
var endDate;
var endJaunt;

var startTime;
var startDate;
var startJaunt;

var title;
var code;
var description;

var address;

var location;

var parseFile;

var userId;

var loginErrorMessage;

$(function(){

    if(currentUser){
        $('#navBar').append(
            '<div class="container">'+
            ' <div class="navbar-header">'+
            '  <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">'+
            ' <span class="sr-only">Toggle navigation</span>'+
            '           <span class="icon-bar"></span>'+
            '           <span class="icon-bar"></span>'+
            '           <span class="icon-bar"></span>'+
            '       </button>'+
            '       <a class="navbar-brand" href="#">H I I K E Y</a>'+
            '   </div>'+
            '   <div id="navbar" class="navbar-collapse collapse">'+
            '       <ul class="nav navbar-nav">'+
            '           <li ><a href="home">Home</a></li>'+
            '           <li><a href="search">Search</a></li>'+
            '           <li  class="active" ><a href="create">Create Event</a></li>'+
            '           <li > <a href="profile">Profile</a></li>'+

            '        </ul>'+
            '   </div>'+
            '</div>'
        );

    } else {

        $('#navBar').append(
            '<div class="container">'+
            ' <div class="navbar-header">'+
            '  <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">'+
            ' <span class="sr-only">Toggle navigation</span>'+
            '           <span class="icon-bar"></span>'+
            '           <span class="icon-bar"></span>'+
            '           <span class="icon-bar"></span>'+
            '       </button>'+
            '       <a class="navbar-brand" href="/">H I I K E Y</a>'+
            '   </div>'+
            '   <div id="navbar" class="navbar-collapse collapse">'+
            '       <ul class="nav navbar-nav">'+
            '           <li ><a href="home">Home</a></li>'+
            '<li><a href="search">Search</a></li>'+
            '           <li  class="active" ><a href="create">Create Event</a></li>'+
            '        </ul>'+
            '   </div>'+
            '</div>'
        );
    }

    $(":file").change(function () {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = imageIsLoaded;
            reader.readAsDataURL(this.files[0]);
        }
    });

    $('#submitButton').click(function () {
        endTime = document.getElementById('endTime').value;
        endDate = document.getElementById('endDate').value;
        endJaunt = $('#endTime').timepicker('getTime', endDate);

        startTime = document.getElementById('startTime').value;
        startDate = document.getElementById('startDate').value;
        startJaunt = $('#startTime').timepicker('getTime', startDate);

        title = document.getElementById('title').value;

        description = document.getElementById('description').value;
        address = document.getElementById('address').value;

        /*var ya = $('#startTime').timepicker('getTime', startDate);
        var cha =  new Date(startDate);

        console.log(ya);*/

        var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" +
            address +
            "&key=" +
            "AIzaSyAdnr849aDFzuYIJBTqyzdapF_7aR8AikI";
        location =  geocodeAddress(url);

       // alert("asdf");
       // alert(location);
        if (validateDetails(title, startDate, startTime, startJaunt, endDate, endTime, endJaunt, address)){

            if (currentUser){
                title = title.replace(/\s+/g, '');
                code = title + "-" + currentUser.get("username");
                createEvent(eventImage,endJaunt, code, startJaunt, address, location, title, description, currentUser.id);

            } else {
                $('#registerModal').modal('show');
            }

        } else {
            alert(errorMessage);
        }
    });

    /**user ish here **/

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

    $('#signupAction').click(function () {

        var username =  document.getElementById('signupUsername').value;
        var password =  document.getElementById('signupPassword').value;
        var email = document.getElementById('signupEmail').value;

        if (validateSignup(username, email)){
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
                    code = title + user.get("username");
                    userId = user.id;
                    //TODO: show profile modal
                    $('#registerModal').modal('hide');
                    $('#profileModal').modal('show');
                },
                error: function(user, error) {
                    // Show the error message somewhere and let the user try again.
                    alert(error.message);
                }
            });

        } else {
            alert(loginErrorMessage);
        }
    });

    $('#signinAction').click(function () {

        var username =  document.getElementById('inputUsername').value;
        var password =  document.getElementById('inputPassword').value;

        parse.User.logIn(username, password, {
            success: function(user) {
                title = title.replace(/\s+/g, '');
                code = title + "-" + user.get("username");
                createEvent(eventImage,endJaunt, code, startJaunt, address, location, title, description, user.id);
            },
            error: function(user, error) {
                alert(error);
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
        query.get(userId, {
            success: function(object) {

                object.set("DisplayName", document.getElementById('inputName').value);
                // var image = (object.get("Profile").name())[0].src = object.get("Profile").url();
                object.set("phoneNumber", document.getElementById('inputNumber').value);
                object.set("Profile", parseFile);
                object.set("phoneNumber", verifiedNumber);
                object.save();
                title = title.replace(/\s+/g, '');
                code = title + "-" + object.get("username");

                createEvent(eventImage,endJaunt, code, startJaunt, address, location, title, description, userId);

                //document.getElementById('image').src
            },
            error: function(object, error) {
                // The object was not retrieved successfully.
                // error is a Parse.Error with an error code and message.
                title = title.replace(/\s+/g, '');
                code = title + "-" + object.get("username");
                createEvent(eventImage,endJaunt, code, startJaunt, address, location, title, description, userId);
            }
        });
    });
});

function imageIsLoaded(e) {
    $('#image').attr('src', e.target.result);
    $('#profileImage').attr('src', e.target.result);

    var fileUploadControl = $("#newEventImage")[0];
    var fileUploadControl1 = $("#newProfilePhoto")[0];

    if (eventImage == null) {
        var file = fileUploadControl.files[0];
        var name = "photo.jpg";

        eventImage = new parse.File(name, file);
        eventImage.save().then(function() {
            // The file has been saved to Parse.
            //alert("worked");
        }, function(error) {
            // The file either could not be read, or could not be saved to Parse.
            alert(error);
        });

    } else {
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
    }
    // document.getElementById('image').src = e.target.result
}

function createEvent(eventImage, endTime, code, startTime, address, location, title, description, user){
    var newEvent = parse.Object.extend("Event");
    var event = new newEvent();
    event.set("eventImage", eventImage);
    event.set("userId", user);
    event.set("endTime", endTime);
    event.set("code", code);
    event.set("startTime", startTime);
    event.set("address", address);
    event.set("location", location);
    event.set("isRemoved", false);
    event.set("isSubscribed", true);
    event.set("title", title);
    event.set("description", description);
    event.set("invites", []);
    event.save(null, {
        success: function(gameScore) {

            window.location.href = "https://www.hiikey.com/home";
            //window.location.href = "http://localhost:3000/home";
        },
        error: function(gameScore, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and message.
            alert('Failed to create new object, with error code: ' + error.message);
        }
    });
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
               // alert(result);

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

    if (eventImage == null){
        errorMessage = "Event Image Required";
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