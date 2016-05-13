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
var ticketsSold = [];
var ticketsAvailable = [];
var eventUser;
var merchantId;
var status;
var currentUser;
var logUrl;

var userObjectId;

//twitter login
passport.use('events', new FacebookStrategy({
        clientID: "178018185913116",
        clientSecret: "a561ac32e474b6d927d512a8f3ae37df",
        callbackURL: "https://www.hiikey.com/events/auth/facebook/callback",
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

    router.get('/', function (req, res, next) {
        eventId = req.query.id;
        
       /* if (eventId == null){
            eventId = req.query.id;
        }*/

        parse.User.enableUnsafeCurrentUser();
        currentUser = parse.User.current();

        //currentUser = "0IOlbiZ9Tw";

        if (currentUser){
           // logUrl = "/events/logout";
            status = "Checkout";
            loadEventInfo(res, true, currentUser);
            
           // loadEventInfo(res, true, "doms230@aol.com");

        } else{
            //logUrl = "/login/auth/facebook";
            status = "Login before purchase";
            loadEventInfo(res, false);
        }
    });

    router.get('/logout', function (req, res) {
        parse.User.logOut();
        //logUrl = "/login/auth/facebook";
        status = "Login before purchase";
        name = "";
        loadEventInfo(res, false);
    }, function(err, account) {
    // asynchronously called
    if (err != null){
        res.send(err)

    } else {
        res.send(account)
    }
});

router.get('/auth/facebook',
    passport.authenticate('events', { scope: ['public_profile', 'email'] }));

router.get('/auth/facebook/callback',
    passport.authenticate('events', { failureRedirect: '/events?id=' + eventId }),
    function(req, res) {
        // Successful authentication, redirect home.

        res.redirect('/events/login');
        //res.send("all good");
    });

router.get('/login', function(req, res){
    loginUser(username, password, email, name, gender, photo, req, res);
});

//Main UI Data Jaunts

router.get('/createUser', function (req, res ) {
    createUser(username, password, email, name, gender, photo , req, res);
});

function loadUserInfo(res, username){
}

function loadEventInfo(res, logged, username){
    var logButton;
    var user;
    if (logged){
        logButton = "Sign out";
        user = "Welcome " + username + "!";

    } else {
        logButton = "Sign in with Facebook";
        user = "Welcome!"
    }

    var eventQuery = parse.Object.extend('PublicPost');
    var query = new parse.Query(eventQuery);
    query.get(eventId, {
        success: function (event) {
            // The object was retrieved successfully.
            var yoma = event.get('Flyer');
            ("flyer_ios")[0].src = yoma.url();
            image =  ("flyer_ios")[0].src;

            eventUser = event.get("userId");
            description = event.get('Description');
            title = event.get('Title');
            date = event.get('Date');

            var month = date.getMonth();
            var day = date.getDay();
            var year = date.getFullYear();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var time = date.getTime();

            var formattedDate = month + "/" + day + "/" + year + "," + hour + ":" + minute;

            console.log(formattedDate);
            ticketName = event.get('ticketName');
            ticketPrice = event.get('ticketPrice');
            ticketsAvailable = event.get('ticketAvailable');
            ticketsSold = event.get('ticketSold');
            address = event.get('Address');

            var user = parse.Object.extend('_User');
            var query = new parse.Query(user);
            query.get(eventUser, {
                success: function (user) {
                    // The object was retrieved successfully.
                    merchantId = user.get('merchantId');

                    var data = [];

                    for (var i = 0; i < ticketName.length; i ++ ){
                        data.push({
                            name: ticketName[i],
                            price: ticketPrice[i],
                            id: i,
                            minusButton: "minusButton" + i,
                            addButton: "addButton" + i,
                            priceId: "price" + i,
                            nameId: "name" + i
                        });
                    }

                    res.render('event', {
                        title: title,
                        date: date,
                        description: description,
                        image: ("flyer_ios")[0].src = yoma.url(),
                        logButton: logButton,
                        user: name,
                        data: data, 
                        status: status,
                        loginUrl: ""
                    });
                },
                error: function (object, error) {
                    // The object was not retrieved successfully.
                    // error is a Parse.Error with an error code and message.
                    console.log(error);
                    console.log(object);
                }
            });

           /* var data = [];
            for (var i = 0; i < ticketName.length; i ++ ){
                data.push({
                    name: ticketName[i],
                    price: ticketPrice[i],
                    id: i,
                    minusButton: "minusButton" + i,
                    addButton: "addButton" + i,
                    priceId: "price" + i
                });
            }

            res.render('event', {
                title: title,
                date: formattedDate,
                description: description,
                image: ("flyer_ios")[0].src = yoma.url(),
                logButton: logButton,
                user: user,
                data: data
            });*/
        },
        error: function (object, error) {
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
            console.log(error);
            console.log(object);
        }
    });
}

router.get('/getMerchant', function (req, res, next) {
    res.send(merchantId);
});

router.post('/updateTickets', function (req, res) {
    var ticketQuantity = req.body.ticketQuantity;
    var purchaseId = req.body.purchase;

    var resultJaunt;
    // var ticketQuantity = [0,3,0];

    var updateEvent = parse.Object.extend("PublicPost");
    var eventQuery = new parse.Query(updateEvent);
    eventQuery.get(eventId, {
        success: function (ticket) {
            var ticketSold = ticket.get('ticketSold');

            for (var i = 0; i < ticketSold.length; i++) {
                ticketSold[i] = ticketSold[i] + parseInt(ticketQuantity[i]);
            }

            ticket.set('ticketSold', ticketSold);
            ticket.save(null, {
                success: function (gameScore) {
                    // Execute any logic that should take place after the object is saved.
                    //alert('New object created with objectId: ' + gameScore.id);
                    //res.redirect("/profile");
                },
                error: function (gameScore, error) {
                    // Execute any logic that should take place if the save fails.
                    // error is a Parse.Error with an error code and message.
                    //  alert('Failed to create new object, with error code: ' + error.message);
                }
            });
        },
        error: function (object, error) {
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
        }
    });

    if (purchaseId != "free") {
        var Purchase = parse.Object.extend("Refunds");
        var purchase = new Purchase();

        purchase.set("eventId", eventId);
        purchase.set("purchaseId",purchaseId);
        purchase.set("ticketHolderId", userObjectId);

        purchase.save(null, {
            success: function (gameScore) {
                // Execute any logic that should take place after the object is saved.
                //alert('New object created with objectId: ' + gameScore.id);
            },
            error: function (gameScore, error) {
                // Execute any logic that should take place if the save fails.
                // error is a Parse.Error with an error code and message.
                //  alert('Failed to create new object, with error code: ' + error.message);
            }
        });
    }

    //right now this is updating results... do thing that creates new line in collection if it doesn't exist.

    var updateTickets = parse.Object.extend("Tickets");
    var ticketQuery = new parse.Query(updateTickets);
    ticketQuery.equalTo("eventId", eventId);
    ticketQuery.equalTo("ticketHolderId",userObjectId);
    ticketQuery.find({
        success: function (results) {
            if (results.length == 0) {
                resultJaunt = "Tickets acquired";
                var Ticket = parse.Object.extend("Tickets");
                var ticket = new Ticket();

                ticket.set("ticketName", ticketName);
                ticket.set("ticketQuantity", [1, 0, 0]);
                ticket.set("eventId", eventId);
                ticket.set("eventName", title);
                ticket.set("ticketHolderId", userObjectId);
                ticket.set("isRemoved", false);
                ticket.set("didRSVP", false);
                ticket.set("didCheckin", false);

                ticket.save(null, {
                    success: function (gameScore) {
                        // Execute any logic that should take place after the object is saved.
                        //alert('New object created with objectId: ' + gameScore.id);
                         //res.send("yoma");
                    },
                    error: function (gameScore, error) {
                        // Execute any logic that should take place if the save fails.
                        // error is a Parse.Error with an error code and message.
                        //  alert('Failed to create new object, with error code: ' + error.message);
                    }
                });
            } else  {
                resultJaunt = "Only one ticket per Hiikey user can be acquired at this time.";

                /*for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    var tickets = object.get('ticketQuantity');
                }
                console.log(tickets[0]);

                for (var o = 0; i < tickets.length; o++) {
                    tickets[o] =  parseInt(tickets[o] + ticketQuantity[o]);
                }

                console.log("after: " + tickets[0] );

                results.set('ticketQuantity', tickets);
                results.save(null, {
                    success: function (gameScore) {
                        // Execute any logic that should take place after the object is saved.
                        //alert('New object created with objectId: ' + gameScore.id);

                        res.send("yoma");
                        //res.redirect("/profile");
                    },
                    error: function (gameScore, error) {
                        // Execute any logic that should take place if the save fails.
                        // error is a Parse.Error with an error code and message.
                        //  alert('Failed to create new object, with error code: ' + error.message);
                    }
                });*/

                // res.redirect("/profile");
            }

            res.send(resultJaunt);
        },
        error: function (error) {
        }
    });


    //add purchase Id to refund collection

});

//login jaunts

function createUser(username, password, email, name, gender, photo, res){

    var user = new parse.User();
    user.set("username", username);
    user.set("password", password);
    user.set("email", email);
    user.set("DisplayName", name);
    user.set("gender", gender);
    user.set("age", "");

    //var file = new parse.File("facebookImage.jpeg", photo);
    //user.set("Profile", file);

    user.signUp(null, {
        success: function(user) {
            // Hooray! Let them use the app now.
            //change button to log out.. show stripe buy tickets jaunt
            console.log("created:" + user);

            parse.User.become(parse.Session.current()).then(function (user) {
                userObjectId = user.id;
                res.redirect('/events?id=' + eventId );
            }, function (error) {
                res.send('/events?id=' + eventId );
            });
        },
        error: function(user, error) {
            // Show the error message somewhere and let the user try again.
            console.log(user);
            console.log("error" + error);
            alert("Error: " + error.code + " " + error.message);
        }
    });
}

function loginUser(username, password, email, name, gender, photo, req, res){
    parse.User.logIn(username, password, {
        success: function(user) {
            //change button to log out and stripe buy tickets jaunt

            parse.User.become(parse.Session.current()).then(function (user) {
                userObjectId = user.id;
                // The current user is now set to user.
                res.redirect('/events?id=' + eventId );
                //console.log("asdf");
            }, function (error) {
                res.redirect('/events?id=' + eventId );
                //console.log("error");
            });
        },
        error: function(user, error, res) {
            //createUser(username, password, email, name, gender, photo);
            //needSignup = true;
                createUser(username, password, email, name, gender, photo , res);
            //res.redirect('/createUser');
        }
    });
}

module.exports = router;