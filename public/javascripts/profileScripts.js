/**
 * Created by d_innovator on 2/27/17.
 *
 * watchify public/javascripts/profileScripts.js -o public/javascripts/profileBundle.js -v
 */

var parse = require("parse").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF"); parse.serverURL = 'http://localhost:3000/parse';
var currentUser = parse.User.current();
var parseFile;

$(function(){
   // $('#updatePhoto').click(function () {
        $(":file").change(function () {
            if (this.files && this.files[0]) {
                var reader = new FileReader();
                reader.onload = imageIsLoaded;
                reader.readAsDataURL(this.files[0]);
            }
        });
    //});

    $('#updateInfo').click(function () {
        var User = parse.Object.extend("_User");
        var query = new parse.Query(User);
        query.get("wcbsnOpMwH", {
            success: function(object) {
                //console.log(object);
                // The object was retrieved successfully.
               // var username = object.getUsername();
                object.set("DisplayName", document.getElementById('inputName').value);
               // var image = (object.get("Profile").name())[0].src = object.get("Profile").url();
                object.set("phoneNumber", document.getElementById('inputNumber').value);
                object.set("Profile", parseFile);
                object.save();

                //document.getElementById('image').src
            },
            error: function(object, error) {
                // The object was not retrieved successfully.
                // error is a Parse.Error with an error code and message.
            }
        });
    });

    loadUserInfo();

});

function imageIsLoaded(e) {
    $('#image').attr('src', e.target.result);
    var fileUploadControl = $("#newProfilePhoto")[0];
    if (fileUploadControl.files.length > 0) {
        var file = fileUploadControl.files[0];
        var name = "photo.jpg";

        parseFile = new parse.File(name, file);
        parseFile.save().then(function() {
            // The file has been saved to Parse.
            alert("worked");
        }, function(error) {
            // The file either could not be read, or could not be saved to Parse.
            alert(error);
        });
    }
   // document.getElementById('image').src = e.target.result
}

function loadUserInfo(){
    //if (currentUser){
        var User = parse.Object.extend("_User");
        var query = new parse.Query(User);
        query.get("wcbsnOpMwH", {
            success: function(object) {
                //console.log(object);
                // The object was retrieved successfully.
                var username = object.getUsername();
                var displayName = object.get("DisplayName");
                var image = (object.get("Profile").name())[0].src = object.get("Profile").url();
                var number = object.get("phoneNumber");

                $("#username").html("@" + username);
                document.getElementById('inputName').value = displayName;
                document.getElementById('inputNumber').value = number;
                document.getElementById('image').src = image;
            },
            error: function(object, error) {
                // The object was not retrieved successfully.
                // error is a Parse.Error with an error code and message.
            }
        });
    //}
}
