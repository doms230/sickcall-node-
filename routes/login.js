/**
 * Created by macmini on 4/13/16.
 */
var express = require('express');
var router = express.Router();

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

passport.use(new FacebookStrategy({
        clientID: "178018185913116",
        clientSecret: "a561ac32e474b6d927d512a8f3ae37df",
        callbackURL: "http://localhost:3000/login/auth/facebook/callback",
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

router.get('/', function (req, res, next) {

    var currentUser = parse.User.current();


   // res.redirect("/auth/facebook");
});

router.get('/complete', function(req, res){
    parse.User.enableUnsafeCurrentUser();
    loginUser(username, password, email, name, gender, photo, req, res);
});

router.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['public_profile', 'email'] }));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/events?id=' + username }),
    function(req, res) {
        // Successful authentication, redirect home.

        res.redirect('/login/complete');
        //res.send("all good");
    });

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
                res.send(user);
                console.log("success" + user);
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
                console.log("success" + user);
                res.send(user);
            }, function (error) {
                res.send(error);
                console.log('failed' + error);
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