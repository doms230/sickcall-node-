/**
 * Created by macmini on 3/24/16.
 */
var express = require('express');
var router = express.Router();
var stripe = require("stripe")(
    "sk_test_HSpPMwMkr1Z6Eypr5MMldJ46"
);

router.post('/buyTickets', function(req, res){

    var stripeToken = request.body.stripeToken;

    var charge = stripe.charges.create({
        amount: request.body.amount, // amount in cents, again
        currency: "usd",
        source: stripeToken,
        description: "Example charge"
    }, function(err, charge) {
        if (err && err.type === 'StripeCardError') {
            // The card has been declined

            res.send(err);
        } else {
            res.send(charge);
        }
    });

});