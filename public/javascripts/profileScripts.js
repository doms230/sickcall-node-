/**
 * Created by d_innovator on 2/27/17.
 */

var parse = require("parse").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF"); parse.serverURL = 'http://localhost:3000/parse';
var currentUser = parse.User.current();

$(function(){
    $('#updatePhoto').click(function () {
        
    });

    $('#updateInfo').click(function () {

    });

    loadUserInfo();
    
});
 
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

                document.getElementById('username').value = username;
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
