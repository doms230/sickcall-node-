/**
 * Created by macmini on 4/13/16.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport')
    , FacebookStrategy = require('passport-facebook').Strategy;
var parse = require("parse/node").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF", "bctRQbnLCvxRIHaJTkv3gqhlwSzxjiMesjx8kEwo");

var userObjectId;
var currentUser;

var eventIds = [] ;
var eventTitles = [];
var eventdates = [];

var username;
var password;
var gender;
var email;
var name;

passport.use('profile', new FacebookStrategy({
 clientID: "178018185913116",
 clientSecret: "a561ac32e474b6d927d512a8f3ae37df",
 callbackURL: "https://www.hiikey.com/profile/auth/facebook/callback",
    //callbackURL: "http://localhost:3000/profile/auth/facebook/callback",
 profileFields: ['id', 'name', 'age_range','gender', 'emails', 'picture.type(large)']
 },
 function(accessToken, refreshToken, profile, cb) {
 //username acts as "username" & "email"
 username = profile.emails[0].value;
 password = profile.id;
 gender = profile.gender;
 photo = profile.photos[0].value;
 email = username;
 name = profile.name.givenName + " " + profile.name.familyName;
 cb(null, profile);
 }
 ));

/* GET home page. */
router.get('/', function(req, res, next) {
    
    var success = req.query.id; 
    parse.User.enableUnsafeCurrentUser();
   // currentUser = parse.User.current();

    //currentUser = "0IOlbiZ9Tw";

    parse.User.logOut();
    currentUser = parse.User.current();

    if (currentUser){
        //logUrl = "/events/logout";
        //status = "Checkout";
        loadUserInfo(res, true);

        // loadEventInfo(res, true, "doms230@aol.com");

    } else{
        //logUrl = "/login/auth/facebook";
        //status = "Login before purchase";
        //loadUserInfo(res);
        
        name = "";
        var data = [];
        
        for (var o = 0; o < 1; o ++ ){
            data.push({
                title: " No Events ",
                date:  " "
            });
        }
        if (success == null ){
            res.render('profile', {
                data: data,
                userId: "",
                user: name,
                logButton: "Sign in with Facebook",
                ticketAlert: false,
                ticketMessage: ""
            });
        } else {
            var message = "";
            if (success == "no"){
                message = "Only one ticket per Hiikey user can be acquired at this time.";
            } else{
                message = "Tickets acquired, sign in again & show this page at the door.";
            }
            res.render('profile', {
                data: data,
                userId: "",
                user: name,
                logButton: "Sign in with Facebook",
                ticketAlert: false,
                ticketMessage: message
            });
        }
    }
});

router.get('/auth/facebook',
    passport.authenticate('profile', { scope: ['public_profile', 'email'] }));

router.get('/auth/facebook/callback',
    passport.authenticate('profile', { failureRedirect: 'profile' }),
    function(req, res) {
        // Successful authentication, redirect home.

        res.redirect('/profile/login');
        //res.send("all good");
    });

router.get('/login', function(req, res){
    loginUser(username, password, email, name, gender, photo, req, res);
});

router.get('/logout', function (req, res) {
    parse.User.logOut();

    res.redirect('/profile');
});

function loadUserInfo(res, logged){
    /*res.render('profile',{
        userId: userObjectId
    });*/

    var logButton;
    var user;
    if (logged){
        logButton = "Sign out";
        user = "Welcome " + username + "!";

    } else {
        logButton = "Sign in with Facebook";
        user = "Welcome!"
    }
    
    var userEvents = parse.Object.extend("Tickets");
    var query = new parse.Query(userEvents);
    query.equalTo("ticketHolderId", userObjectId);
    query.find({
        success: function(results) {
            // Do something with the returned Parse.Object values
            console.log(results.length);

            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                eventIds[i] = object.get('eventId');
            }
            //console.log(eventIds[0]);

            var loadEvents = parse.Object.extend("PublicPost");
            var query = new parse.Query(loadEvents);
            query.containedIn("objectId", eventIds);
            query.find({
                success: function(results) {
                    // Do something with the returned Parse.Object values
                    for (var i = 0; i < results.length; i++) {
                        var object = results[i];
                        eventTitles[i] = object.get('Title');
                        eventdates[i] = object.get('Date');
                    }

                    var data = [];

                    for (var o = 0; o < eventTitles.length; o ++ ){
                        data.push({
                            title: eventTitles[o],
                            date: eventdates[o].toLocaleString()
                        });
                    }
                    
                    res.render('profile', {
                        data: data,
                        userId: userObjectId,
                        logButton: logButton,
                        user: name
                    });
                },
                error: function(error) {
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        },
        error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
        }
    });
}

function createUser(username, password, email, name, gender, photo, req, res){

    var user = new parse.User();
    user.set("username", username);
    user.set("password", password);
    user.set("email", email);
    user.set("DisplayName", name);
    user.set("gender", gender);
    user.set("age", "");

    /*var file = new parse.File("facebookImage.jpeg", photo);
     user.set("Profile", file);*/

    user.signUp(null, {
        success: function(user) {
            // Hooray! Let them use the app now.
            //change button to log out.. show stripe buy tickets jaunt
            console.log("created:" + user);

            parse.User.become(parse.Session.current()).then(function (user) {
                userObjectId = user.id;
                res.redirect('/profile');
            }, function (error) {
                res.send(error);
                console.log('failed' + error);
            });
        },
        error: function(user, error) {
            // Show the error message somewhere and let the user try again.
            alert("Error: " + error.code + " " + error.message);
        }
    });
}

function loginUser(username, password, email, name, gender, photo, req, res){
    parse.User.logIn(username, password, {
        success: function(user) {
            //change button to log out and stripe buy tickets jaunt

            parse.User.become(parse.Session.current()).then(function (user) {
                // The current user is now set to user.
                userObjectId = user.id;
                res.redirect('/profile');
            }, function (error) {
                res.send(error);
                console.log('failed' + error);
            });
        },
        error: function(user, error) {
            //createUser(username, password, email, name, gender, photo);
            //needSignup = true;
            if (error.code == 101){
                createUser(username, password, email, name, gender, photo, res);
            }
        }
    });
}

module.exports = router;