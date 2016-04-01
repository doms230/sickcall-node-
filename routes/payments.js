/**
 * Created by macmini on 3/24/16.
 */
var express = require('express');
var router = express.Router();
var stripe = require("stripe")(
    "sk_test_HSpPMwMkr1Z6Eypr5MMldJ46"
);

router.get('/', function(req, res, next) {
    res.send("yoma");
});

router.post('/buyTickets', function(req, res){

    //res.send("yo");
    //var stripeToken = request.body.stripeToken;

    var charge = stripe.charges.create({
        amount: req.body.amount, // amount in cents, again
        currency: "usd",
        //source: "tok_17sg6BHskqJlyyfa8z5b6uNH",
        source: req.body.stripeToken,
        destination: req.body.account,
        application_fee: (req.body.amount * .029) + .30,
        description: req.body.description
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