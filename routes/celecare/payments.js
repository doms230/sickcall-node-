/**
 * Created by macmini on 7/4/17.
 *
 * http://localhost:5000/payments/addCard?isCustomer=false&email=doms230@live.com
 */

var express = require('express');
var router = express.Router();
//var http = require('http');

var stripe = require("stripe")(
    "sk_test_XjgzLWe3uty249H9iZ6YtzId"
);

router.post('/', function(req, res, next) {


});

router.post('/pay', function(req, res, next){


    var charge = stripe.charges.create({
        amount: req.body.amount,
        currency: "usd",
        description: req.body.description,
        source: req.body.token,
        customer: req.body.customer
    }, function(err, charge) {
        if (err == null){
            res.send(charge);
            console.log(charge);
        } else {
            res.send(err);
            console.log(err);
        }
        // asynchronously called
    });

});



router.post('/addCard',function(req,res,next){

    //int
    var exp_month = req.params.exp_month;
    //int
    var exp_year = req.params.exp_month;
    //string
    var number = req.params.number;
    //int
    var cvc = req.params.cvc;

    stripe.customers.createSource(
        req.params.customerId,
        {
            source: {
                object: 'card',
                exp_month: exp_month,
                exp_year: exp_year,
                number: number,
                cvc: cvc
            } },
        function(err, card) {
            if(err == null){
                res.send(err);

            } else {
                res.send(card);
            }
        }
    );

   /* //boolean
    var isCustomer = true;
    //string
    var email = "doms230@Live.com";

    //int
    var exp_month = 8;
    //int
    var exp_year = 2018;
    //string
    var number = "4242 4242 4242 4242";
    //int
    var cvc = 100;*/

    /*if (isCustomer == true){
        stripe.customers.createSource(
            req.params.customerId,
            {
                source: {
                    object: 'card',
                    exp_month: exp_month,
                    exp_year: exp_year,
                    number: number,
                    cvc: cvc
                } },
            function(err, card) {
                if(err == null){
                    res.send(err);

                } else {
                    res.send(card);
                }
            }
        );

    } else {
        createCustomer( email, exp_month, exp_year, number, cvc, res);
    }*/

});

router.post('/addCustomer', function(req, res, next){
    console.log("email: " + req.query.email);

    stripe.customers.create({
        email: req.query.email
    }).then(function(customer){

        res.send(customer);

        //saveCustomerId(userId, source.customer);

    }).catch(function(err) {
        res.send(err);
    });

});

//stripe stuff
router.post('/ephemeral_keys', (req, res) => {
    const stripe_version = req.query.api_version;
    if (!stripe_version) {
        res.status(400).end();
        return;
    }
    // This function assumes that some previous middleware has determined the
    // correct customerId for the session and saved it on the request object.
    stripe.ephemeralKeys.create(
        {customer: req.query.customerId},
        {stripe_version: stripe_version}
    ).then((key) => {
        res.status(200).json(key);
    }).catch((err) => {
        res.status(500).end();
    });
});

/*function createCustomer( email, exp_month, exp_year, number, cvc, res){
}*/

module.exports = router;