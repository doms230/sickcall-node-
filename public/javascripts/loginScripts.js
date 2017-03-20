/**
 * Created by macmini on 3/20/17.
 */

var parse = require("parse").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF"); parse.serverURL = 'http://localhost:3000/parse';

//var currentUser = true;
$(function(){

    parse.User.logOut().then(() => {
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
        //user.set("Profile", " ");
        user.set("phoneNumber", " ");
        user.set("twitter", " ");
        user.set("facebook", " ");

        user.signUp(null, {
            success: function(user) {
                window.location.href = "http://localhost:3000/profile" ;
            },
            error: function(user, error) {
                // Show the error message somewhere and let the user try again.
                alert("Error: " + error.message);
            }
        });
    });

    $('#signinButton').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        $('#signup').hide();
        $('#signin').show();
    });

    $('#signupButton').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        $('#signup').hide();
        $('#signin').show();
    });




    //check to se if user is logged in

});