/**
 * Created by macmini on 7/4/17.
  */

var express = require('express');
var router = express.Router();
var http = require('http');

var stripe = require("stripe")("sk_live_i757TXWOABq1CfpbtQVsZZAv");

var parse = require("parse/node").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF", "bctRQbnLCvxRIHaJTkv3gqhlwSzxjiMesjx8kEwo");

router.get('/', function(req, res, next) {
    res.send("asdf");
});

router.post('/createCharge', function(req, res, next){   
    //live  
    var charge = stripe.charges.create({
        amount: 1299,
        currency: "usd",
        capture: false,
        description: req.body.description,
        source: req.body.token,
      //  customer: req.body.customer,
        receipt_email: req.body.email
    }, function(err, charge) {
        if (err == null){
            //success
            res.send(charge);
        } else {
            res.send(err);
        }
        // asynchronously called
    });

    //test 
    //res.json({ id: "test" });
});

 function refundCharge(charge){

 }

router.post('/captureCharge', function(req, res, next){
    var chargeId = req.body.charge; 
    var connectId = req.body.connectId; 
    var userId = req.body.user;

    stripe.charges.capture(chargeId, function(err, charge) {
        if (err != null){
            res.send(err);

        } else {
            transferFunds(chargeId, connectId, res);
            sendNotification(userId);
        }
      });
});

function transferFunds(charge, account, res){
    stripe.transfers.create({
        amount: 500,
        currency: "usd",
        source_transaction: charge,
        destination: account,
      }).then(function(err,transfer) {
        if (err != null){
            res.send(err);

        } else {
            res.send(transfer);
        }
      });
}

router.post('/newAccount', function(req, res){
    var date = new Date();
    var timeStamp = Math.floor(date/1000);
    stripe.accounts.create({
        type: 'custom',
        country: 'US',
        email: req.body.email,
        legal_entity: {
            ssn_last_4: req.body.ssn_last_4,
            personal_id_number: req.body.personal_id_number,
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
            ip: req.connection.remoteAddress
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

function sendNotification(user){
    var message = "Your Sickcall has been answered!"

    var query = new parse.Query(parse.Installation);
    query.equalTo('userId', user);

    parse.Push.send({
        where: query,
        data: {
            alert: message,
            badge: 1,
            sound: 'default'
        }
    }, {
        useMasterKey: true,
        success: function (object) {
            //res.send(object);
            res.sendStatus(200);
        },
        error: function (error) {
            // There was a problem :(
            res.send(error);
        }
    });
}



module.exports = router;