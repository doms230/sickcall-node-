/**
 * Created by macmini on 4/7/16.
 */
var express = require('express');
var router = express.Router();
var stripe = require("stripe")(
    "sk_test_HSpPMwMkr1Z6Eypr5MMldJ46"
);

var passport = require('passport')
    , FacebookStrategy = require('passport-facebook').Strategy;

var parse = require("parse/node").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF", "bctRQbnLCvxRIHaJTkv3gqhlwSzxjiMesjx8kEwo");

//sign in jaunts
var username;
var password;
var name;
var gender;
var photo;
var email;

//event Jaunts
var title;
var date;
var description;
var image;
var eventId;
var address;
var ticketName = [];
var ticketPrice = [];


    router.get('/', function (req, res, next) {
        eventId = req.query.id;
        parse.User.enableUnsafeCurrentUser();
        var currentUser = parse.User.current();

        if (currentUser){
            loadEventInfo(res, true, currentUser.get('username') );

        } else{
            loadEventInfo(res, false);
        }
    });

//twitter login
passport.use(new FacebookStrategy({
        clientID: "178018185913116",
        clientSecret: "a561ac32e474b6d927d512a8f3ae37df",
        callbackURL: "http://localhost:3000/events/auth/facebook/callback",
        profileFields: ['id', 'name', 'age_range','gender', 'emails', 'picture.type(large)']
    },
    function(accessToken, refreshToken, profile, cb) {
        //username acts as "username" & "email"
        username = profile.emails[0].value;
        password = profile.id;
        gender = profile.gender;
        photo = profile.photos[0].value;
        email = username;
        name = profile.name.givenName + "" + profile.name.familyName;

        cb(null, profile);
    }
));

router.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['public_profile', 'email'] }));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/events?id=' + eventId }),
    function(req, res) {
        // Successful authentication, redirect home.

        res.redirect('/events/login');
        //res.send("all good");
    });

router.get('/login', function(req, res){
    loginUser(username, password, email, name, gender, photo, req, res);


});

//Main UI Data Jaunts

function loadUserInfo(res, username){

}

function loadEventInfo(res, logged, username){
    var logButton;
    var user;

    if (logged){
        logButton = "Sign out";
        user = "Welcome " + username + "!";

    } else {
        logButton = "Sign in";
        user = "Welcome!"
    }

    var GameScore = parse.Object.extend('PublicPost');
    var query = new parse.Query(GameScore);
    query.get(eventId, {
        success: function (gameScore) {
            // The object was retrieved successfully.
            var yoma = gameScore.get('Flyer');
            ("flyer_ios")[0].src = yoma.url();
            image =  ("flyer_ios")[0].src;

            description = gameScore.get('Description');
            title = gameScore.get('Title');
            date = gameScore.get('Date');
            ticketName = gameScore.get('ticketName');
            ticketPrice = gameScore.get('ticketPrice');

            /*for (var i = 0; i <= 3; i++){
                if (ticketName[i] == null){
                    ticketName[i] = ""
                }

                if (ticketPrice[i] == null){
                    ticketPrice[i] = ""
                }
            }*/
            address = gameScore.get('Address');

            res.render('event', {
                title: title,
                date: '10/12/2018',
                description: description,
                image: ("flyer_ios")[0].src = yoma.url(),
                logButton: logButton,
                user: user,
                ticketName0: ticketName[0],
                ticketName1: ticketName[1],
                ticketName2: ticketName[2],

                ticketPrice0: ticketPrice[0],
                ticketPrice1: ticketPrice[1],
                ticketPrice2: ticketPrice[2]
                //<img src=<%= image %> class="img-responsive" alt="Responsive image">
            });
        },
        error: function (object, error) {
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
            console.log(error);
            console.log(object);
        }
    });
}

//login jaunts

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
                res.redirect('/events?id=' + eventId );
            }, function (error) {
                res.redirect('/events?id=' + eventId );
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
                res.redirect('/events?id=' + eventId );
            }, function (error) {
                res.redirect('/events?id=' + eventId );
            });
        },
        error: function(user, error, res) {
            //createUser(username, password, email, name, gender, photo);
            //needSignup = true;
            if (error.code == 101){
                createUser(username, password, email, name, gender, photo);
            }

        }
    });
}

module.exports = router;
