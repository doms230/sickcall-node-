/**
 * Created by macmini on 3/24/16.
 */
var express = require('express');
var router = express.Router();
var stripe = require("stripe")(
    "sk_live_wFw3B2lTIGPACNAsoGAH9bPO"
);

var currentUser; 

var parse = require("parse/node").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF", "bctRQbnLCvxRIHaJTkv3gqhlwSzxjiMesjx8kEwo");

router.get('/', function(req, res, next) {

    parse.User.enableUnsafeCurrentUser();
    currentUser = parse.User.current();
    
    res.send("yoma");
});

//refund ticket jaunt jaunts

var chargeIds = [];

router.post('/buyTickets', function(req, res){

    //res.send("yo");
        stripe.charges.create({
        amount: 100, // amount in cents, again
        currency: "usd",
        //source: "tok_17zVIsHskqJlyyfaEiMdnQLB",
        source: req.body.stripeToken,
         destination: req.body.destination,
        //application_fee: (req.body.amount * .029) + .30,
        application_fee: 59,
        description: req.body.description
       // description: req.body.stripeToken.description
    },
    function(err, charge) {
        if (err && err.type === 'StripeCardError') {
            // The card has been declined
            res.send(err);
           // res.send(err);
        } else {
            res.send(charge);
        }
    });
});

router.post('/webBuyTickets', function(req, res){

    /*if (currentUser) {
        //res.send("yo");
        stripe.charges.create({
                amount: req.body.amount, // amount in cents, again
                currency: "usd",
                source: req.body.stripeToken,
                destination: req.body.destination,
                application_fee: req.body.application_fee,
                description: req.body.description
            },
            function (err, charge) {
                if (err && err.type === 'StripeCardError') {
                    // The card has been declined

                    res.send(err);
                } else {
                    //

                    res.send(charge);
                }
            });

    } else {
        
    }*/

    res.json({ id: "Please sign in before purchase." });
    
});

router.get('/buyTicketsTest', function(req, res){

    var totalPrice = 1000 * .029;

    var yoma = totalPrice + .30 ;

    //res.send("yo");
    stripe.charges.create({
            amount: 1000, // amount in cents, again
            currency: "usd",
            source: "tok_1861XvHskqJlyyfasLNcJu23",
            destination: "acct_180hDGJLoSMNpJp1",
            application_fee: (1000 * .029) + .30,
            description: "asdf"
            // description: req.body.stripeToken.description
        },
        function(err, charge) {
            if (err && err.type === 'StripeCardError') {
                // The card has been declined

                res.send(err);
            } else {
                res.send(charge);

                //
                var updateEvent = Parse.Object.extend("PublicPost");
                var query = new Parse.Query(GameScore);
                query.equalTo("playerName", "Dan Stemkoski");
                query.find({
                    success: function(results) {
                        alert("Successfully retrieved " + results.length + " scores.");
                        // Do something with the returned Parse.Object values
                        for (var i = 0; i < results.length; i++) {
                            var object = results[i];
                            alert(object.id + ' - ' + object.get('playerName'));
                        }
                    },
                    error: function(error) {
                        alert("Error: " + error.code + " " + error.message);
                    }
                });
            }
        });

    //
});

router.post('/refundTickets', function(req, res){
    refundticketsAction(res, req.body.eventObjectId);
});

function refundticketsAction(res, eventObjectId){

    var GameScore = parse.Object.extend('Refunds');
    var query = new parse.Query(GameScore);
    query.equalTo("eventId", eventObjectId);
    query.find({
        success: function(results) {
            // Do something with the returned Parse.Object values
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                console.log(object.id + ' - ' + object.get('purchaseId'));
                chargeIds[i] =  object.get('purchaseId');
            }

            for (var o = 0; o < chargeIds.length; o++){
                stripe.refunds.create({
                    //charge: "ch_17zpWKHskqJlyyfaISjIVxHX"
                    charge: chargeIds[o],
                    reverse_transfer: true

                }, function(err, refund) {
                    // asynchronously called
                    if (err){
                        res.send(err);
                    } else{
                        res.send(refund);
                    }
                });
            }
        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
}

module.exports = router;