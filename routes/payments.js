/**
 * Created by macmini on 3/24/16.
 */
var express = require('express');
var router = express.Router();
var stripe = require("stripe")(
    "sk_test_HSpPMwMkr1Z6Eypr5MMldJ46"
);

var parse = require("parse/node").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF", "bctRQbnLCvxRIHaJTkv3gqhlwSzxjiMesjx8kEwo");

router.get('/', function(req, res, next) {
    res.send("yoma");
});

//refund ticket jaunt jaunts

var chargeIds = [];

router.post('/buyTickets', function(req, res){

    //res.send("yo");
        stripe.charges.create({
        amount: req.body.amount, // amount in cents, again
        currency: "usd",
        //source: "tok_17zVIsHskqJlyyfaEiMdnQLB",
        source: req.body.stripeToken,
         destination: req.body.destination,
        //application_fee: (req.body.amount * .029) + .30,
        //application_fee: (1000 * .029) + .30,
        description: "asdf"
       // description: req.body.stripeToken.description
    },
    function(err, charge) {
        if (err && err.type === 'StripeCardError') {
            // The card has been declined

            res.send(err);
        } else {
            res.send(charge);
        }
    });
});

router.post('/refundTickets', function(req, res){

    refundticketsAction(res, req.body.eventObjectId);
});

function refundticketsAction(res, eventObjectId){

    var GameScore = parse.Object.extend('Tickets');
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