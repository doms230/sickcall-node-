/**
 * Created by macmini on 4/7/16.
 */
var express = require('express');
var router = express.Router();
var stripe = require("stripe")(
    "sk_test_HSpPMwMkr1Z6Eypr5MMldJ46"
);

var passport = require('passport')
    , TwitterStrategy = require('passport-twitter').Strategy;

var parse = require("parse/node").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF", "bctRQbnLCvxRIHaJTkv3gqhlwSzxjiMesjx8kEwo");

    var eventId;
    router.get('/', function (req, res, next) {
        eventId = req.query.id;
        var GameScore = parse.Object.extend('PublicPost');
        var query = new parse.Query(GameScore);
        query.get(eventId, {
            success: function (gameScore) {
                // The object was retrieved successfully.
                var yoma = gameScore.get('Flyer');

                res.render('event', {
                    title: gameScore.get("Title"),
                    date: '10/12/2018',
                    description: gameScore.get("Description"),
                    image: ("flyer_ios")[0].src = yoma.url()
                    //<img src=<%= image %> class="img-responsive" alt="Responsive image">
                })
            },
            error: function (object, error) {
                // The object was not retrieved successfully.
                // error is a Parse.Error with an error code and message.
                console.log(error);
                console.log(object);
            }
        });
    });

//twitter login
passport.use(new TwitterStrategy({
        consumerKey: "6wFhCtuTEZMd5yYaEakpG3OPM",
        consumerSecret: "oVmP6E4H56MxGbAdcKDWDbMeuww4mj7K29X5kdoO8W51CqdYQd",
        callbackURL: "http://localhost:3000/webapp/auth/twitter/callback"
    },
    function(token, tokenSecret, profile, cb) {
        /*User.findOrCreate({ twitterId: profile.id }, function (err, user) {
            return cb(err, user);
        });*/

        console.log(profile);
        cb(null, profile);

    }
));

router.get('/auth/twitter',
    passport.authenticate('twitter'));

router.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/webapp?id=' + eventId }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/webapp?id=' + eventId);

        //res.send("all good");
    });

/*passport.serializeUser(function(user, done) {
    console.log('serializeUser: ' + user._id);
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  /*  db.users.findById(id, function(err, user){
        console.log(user)
        if(!err) done(null, user);
        else done(err, null)
    })

    console.log(user);
    if (!err) done (null, user);
    else done(err, null);
});*/




module.exports = router;
