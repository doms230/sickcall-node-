/**
 * Created by macmini on 4/12/16.
 */
var express = require('express');
var router = express.Router();
var http = require('http');

var parse = require("parse/node").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF",
    "bctRQbnLCvxRIHaJTkv3gqhlwSzxjiMesjx8kEwo");

var id;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('welcome',{});
});

/*router.get('/:id', function(req, res, next) {

    id = req.params.id;

    if (id != 'events'){
        switch (id){
            case 'home':
                res.redirect("https://www.hiikey.com/search");
                break;

            case 'about':
                res.redirect("https://www.hiikey.com/about");
                break;

            case 'profile':
                res.redirect("https://www.hiikey.com/profile");
                break;

            case 'logins':
                res.redirect("https://www.hiikey.com/logins");
                break;

            case 'terms':
                res.redirect("https://www.hiikey.com/terms");
                break;

          //  case 'events':
           //  res.redirect('https://www.hiikey.com' + req.originalUrl);
            / //console.log('https://www.hiikey.com' + req.originalUrl);
             //break;

            default:


                var GameScore = parse.Object.extend("_User");
                var query = new parse.Query(GameScore);
                query.equalTo("username", id);
                query.first({
                    success: function(object) {
                        if (object == null){
                            res.redirect('https://www.hiikey.com');

                        } else {
                            loadEvent(object.id, res);
                        }
                    },
                    error: function(error) {
                        res.send('asdfasdf');
                        console.log(error.code + "" + error.message);
                        // alert("Error: " + error.code + " " + error.message);
                    }
                });

                break;
        }
    }

    console.log(id);

});

function loadEvent(user, res){

    var GameScore = parse.Object.extend("Event");
    var query = new parse.Query(GameScore);
    query.equalTo("userId", user);
    query.equalTo('isRemoved', false);
    query.ascending("startTime");
    query.first({
        success: function(object) {
            console.log(object);

            if (object == null){
                res.redirect('https://www.hiikey.com/u/' + id);

            } else{
                var currentDate = new Date();
                var eventDate = object.get('endTime');

                if (currentDate < eventDate) {
                    res.redirect('https://www.hiikey.com/events?id=' + object.id);

                } else {
                    res.redirect('https://www.hiikey.com/u/' + id);
                }
            }
        },
        error: function(error) {
            res.send('asdfasdf');
            console.log(error.code + "" + error.message);
           // alert("Error: " + error.code + " " + error.message);
        }
    });

    var User = parse.Object.extend("Event");
    var query = new parse.Query(User);
    query.equalTo("userId", user);
    query.get(user, {
        useMasterKey:true,
        success: function(object) {

            res.redirect('https://www.hiikey.com/events?id=' + object.id);

        },
        error: function(object, error) {
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
            console.log(error);
        }
    });
}*/

module.exports = router;