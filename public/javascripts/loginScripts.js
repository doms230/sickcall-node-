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

$(function(){

    url = window.location.toString();
    var ya = url.split("e=");
    eventId = ya[1];

    if (currentUser){
        window.location.href = "https://www.hiikey.com/profile";
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

                window.location.href = "https://www.hiikey.com/profile" ;
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
                window.location.href = "https://www.hiikey.com/profile" ;
            },
            error: function(user, error) {
                alert(error);
            }
        });
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
