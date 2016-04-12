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

        stripe.charges.create({
        amount: req.body.amount, // amount in cents, again
        currency: "usd",
        //source: "tok_17zVIsHskqJlyyfaEiMdnQLB",
        source: req.body.stripeToken,
        //destination: req.body.account
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

module.exports = router;