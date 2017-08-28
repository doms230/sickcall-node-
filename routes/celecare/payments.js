/**
 * Created by macmini on 7/4/17.
  */

var express = require('express');
var router = express.Router();
var http = require('http');

var stripe = require("stripe")(
    "sk_test_XjgzLWe3uty249H9iZ6YtzId"
);


router.get('/', function(req, res, next) {
    res.send("asdf");
});

router.post('/createCharge', function(req, res, next){    
    var charge = stripe.charges.create({
        amount: req.body.amount,
        currency: "usd",
        capture: false,
        description: req.body.description,
        source: req.body.token,
      //  customer: req.body.customer,
        receipt_email: req.body.email
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

router.post('/newAccount', function(req, res){
    var date = new Date();
    var timeStamp = Math.floor(date/1000);

    stripe.accounts.create({
        type: 'custom',
        country: 'US',
        email: req.body.email,
        legal_entity: {
            personal_id_number: req.body.personal_id_number,
            ssn_last_4: req.body.ssn_last_4,
            address:{
                city: req.body.city,
                line1: req.body.line1,
                line2: req.body.line2,
                postal_code: req.body.postal_code,
                state: req.body.state
            },
            "dob": {
                day:req.body.day,
                month: req.body.month,
                year: req.body.year
            },
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            type: "individual"
        },

        external_account:{
            object: "bank_account",
            account_number: req.body.account_number,
            country: "us",
            currency: "usd",
            routing_number: req.body.routing_number
        },

        payout_schedule: {
            interval: "weekly",
            weekly_anchor: "wednesday"
        },
        tos_acceptance: {
            date: timeStamp,
            ip: "192.168.1.75"
        }

    }, function(err, account) {
        // asynchronously called
        if (err == null){
            res.send(account);

        }else {
            res.send(err);
        }
    });

});

router.get('/account', function(req, res, next){
    var accountId = req.query.account_Id;
    stripe.accounts.retrieve(
        accountId,
        function(err, account) {
            if (err == null){
                res.send(account);

            } else {
                res.send(err);
            }
        }
    );
});

router.post('/address', function(req, res, next){
    var accountId = req.body.account_Id;
    stripe.accounts.update(accountId, {
         legal_entity: {
            //personal_id_number: req.body.personal_id_number,
            //ssn_last_4: req.body.ssn_last_4,
            address:{
                city: req.body.city,
                line1: req.body.line1,
                line2: req.body.line2,
                postal_code: req.body.postal_code,
                state: req.body.state
            },
           /* dob: {
                day:req.body.day,
                month: req.body.month,
                year: req.body.year
            },
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            type: "individual"*/
        }
  
    }, function(error, account){
        if (error == null){
            res.send(account);

        } else {
            res.send(error);
        }
        
    });    
});

router.post('/bank', function(req, res, next){
var accountId = req.body.account_Id
    stripe.accounts.update(accountId, {
         external_account:{
            object: "bank_account",
            account_number: req.body.account_number,
            country: "us",
            currency: "usd",
            routing_number: req.body.routing_number
        }
  
    }, function(error, account){
        if (error == null){
            res.send(account);

        } else {
            res.send(error);
        }
        
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