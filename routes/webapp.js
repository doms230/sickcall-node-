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
var logButtonTitle;


//event Jaunts
var title;
var date;
var description;
var image;
var eventId;
var address;

    var needSignup = false;

    router.get('/', function (req, res, next) {
        eventId = req.query.id;
        if (req.query.logged){
            //createUser(username, password, name, gender, photo);
            loadEventInfo(res, true);
        } else{
            loadEventInfo(res, false);
        }



    });

//twitter login
passport.use(new FacebookStrategy({
        clientID: "178018185913116",
        clientSecret: "a561ac32e474b6d927d512a8f3ae37df",
        callbackURL: "http://localhost:3000/webapp/auth/facebook/callback",
        profileFields: ['id', 'name', 'age_range','gender', 'emails', 'picture.type(large)']
    },
    function(accessToken, refreshToken, profile, cb) {
        //username acts as "username" & "email"
        username = profile.emails[0].value;
        password = profile.id;
        gender = profile.gender;
        photo = profile.photos[0].value;
        email = username;

        var currentUser = parse.User.current();
        if (currentUser) {
        } else {
            loginUser(username, password, email, name, gender, photo);
        }

        cb(null, profile);
    }
));

router.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['public_profile', 'email'] }));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/webapp?id=' + eventId }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/webapp?id=' + eventId + '&logged=true');

        //res.send("all good");
    });

//Main UI Data Jaunts

function loadEventInfo(res, logged){
    var logButton;
    var currentUser = parse.User.current();
    console.log(currentUser);
    if (logged){
        if (currentUser){
            logButton = "Sign out";
        } else {
            logButton = "Sign in";
        }

    } else {
        logButton = "Sign in";
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
            console.log(date);

            address = gameScore.get('Address');

            res.render('event', {
                title: title,
                date: '10/12/2018',
                description: description,
                image: ("flyer_ios")[0].src = yoma.url(),
                logButton: logButton
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
function createUser(username, password, email, name, gender, photo, res){

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
            needSignup = true;

        },
        error: function(user, error) {
            // Show the error message somewhere and let the user try again.
            alert("Error: " + error.code + " " + error.message);
        }
    });
}

function loginUser(username, password, email, name, gender, photo){
    parse.User.logIn(username, password, {
        success: function(user, res) {
            //change button to log out and stripe buy tickets jaunt
            console.log("logged in:" + user);
            needSignup = true;



        },
        error: function(user, error, res) {
            //createUser(username, password, email, name, gender, photo);
            //needSignup = true;
            if (error.code == 101){
                createUser(username, password, email, name, gender, photo);
                logButtonTitle = "Sign out"

            }

        }
    });
}


module.exports = router;
