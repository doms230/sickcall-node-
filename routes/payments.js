/**
 * Created by macmini on 3/24/16.
 */
var express = require('express');
var router = express.Router();
var stripe = require("stripe")(
    "sk_test_HSpPMwMkr1Z6Eypr5MMldJ46"
);

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/buyTickets', function(req, res){

    //res.send("yo");
    var stripeToken = request.body.stripeToken;

    var charge = stripe.charges.create({
        amount: 17025, // amount in cents, again
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

module.exports = router;