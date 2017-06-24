/**
 * Created by macmini on 5/7/17.
 *
 *  watchify public/javascripts/welcomeScripts.js -o public/javascripts/welcomeBundle.js -v
 */

var parse = require("parse").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF"); parse.serverURL = 'https://hiikey.herokuapp.com/parse';
var currentUser = parse.User.current();

$(function(){
    /*if (currentUser){
        window.location.href = "https://www.hiikey.com/home";
    }*/

    var GameScore = parse.Object.extend("_User");
    var query = new parse.Query(GameScore);
    query.find({
        useMasterKey:true,
        success: function(results) {
            for (var i = 0; i < results.length; i++) {
                var userEmail = object.get('email');

               /* $('#ya').append(

                    '<h3>' + userEmail + '</h3>'
                )*/
                console.log(userEmail);
            }
        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });

   /*var User = parse.Object.extend("_User");
    var emailQuery = new parse.Query(User);
    emailQuery.get(user, {
        useMasterKey:true,
        success: function(object) {

            var userEmail = object.get('email');

            $('#ya').append(

                '<h3>' + userEmail + '</h3>'
            )

        },
        error: function(object, error) {
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
        }
    });

    console.log(window.location.href);
    console.log(window.location);*/
});