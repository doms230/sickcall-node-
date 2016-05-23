/**
 * Created by macmini on 2/27/16.
 */
var express = require('express');
var router = express.Router();
var stripe = require("stripe")(
    "sk_test_HSpPMwMkr1Z6Eypr5MMldJ46"
);

        /* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/merchantInfo', function(req, res){

    //res.send("yo");
    stripe.accounts.retrieve(
        req.query.account,
        //req.param("account"),
        function(err, account) {
            if (err != null){
                res.send(err);
            } else {
                res.send(account);
            }
        }
    );
});

/* POST jaunts  */
router.post('/createMerchant', function (req, res) {

    stripe.accounts.create({
        managed: true,
        country: req.body.country,
      //  business_name: req.body.business_name,
        email: req.body.email,

        business_name:req.body.business_name,
        decline_charge_on:{
            avs_failure:true,
            cvc_failure:true
        },

        legal_entity: {
            address: {
                city: req.body.city,
                country: req.body.country,
                line1: req.body.line1,
                line2: req.body.line2,
                postal_code: req.body.postal_code,
                state: req.body.state
            },

            business_name: req.body.business_name,
            business_tax_id: req.body.business_tax_id,
            dob: {
                day: req.body.day,
                month: req.body.month,
                year: req.body.year
            },

            first_name: req.body.first_name,
            last_name: req.body.last_name,
            ssn_last_4: req.body.ssn_last_4,
            "type": req.body.type
        },
            tos_acceptance: {
                date: Math.floor(Date.now() / 1000),
                ip: req.connection.remoteAddress // Assumes you're not using a proxy
            }
    }, function(err, account) {
        // asynchronously called
        if (err != null){
            res.send(err)

        } else {
            console.log("merchant created.");
           // res.send(account);
            createBankToken(account.id, res, req.body.country, "usd", req.body.account_holder_name,
            req.body.type, req.body.routing_number, req.body.account_number);
        }
    });
});
router.get('/createMerchantTest', function (req, res) {

    stripe.accounts.create({
        managed: true,
        country: "US",
        //  business_name: req.body.business_name,
        email: "",

        business_name:req.body.business_name,
        decline_charge_on:{
            avs_failure:true,
            cvc_failure:true
        },

        legal_entity: {
            address: {
                city: "Dallas",
                country: "US",
                line1: "",
                line2: "",
                postal_code: "",
                state: "TX"
            },

            business_name: "Rodney Blu",
            business_tax_id: "",
            dob: {
                day: "28",
                month: "11",
                year: "1990"
            },

            first_name: "",
            last_name: "",
            ssn_last_4: "",
            "type": "individual"
        },
        tos_acceptance: {
            date: Math.floor(Date.now() / 1000),
            ip: req.connection.remoteAddress // Assumes you're not using a proxy
        }
    }, function(err, account) {
        // asynchronously called
        if (err != null){
            res.send(err)

        } else {
            console.log("merchant created.");
            // res.send(account);
            createBankToken(account.id, res, "US", "usd", "Rodney Wilson",
                "individual", "", "");
        }
    });
});

router.post('/updateMerchant', function (req, res) {
    stripe.accounts.update(

    req.body.account,
    {
        country: req.body.country,
        //  business_name: req.body.business_name,
        email: req.body.email,

        business_name:req.body.business_name,
        decline_charge_on:{
            avs_failure:true,
            cvc_failure:true
        },

        legal_entity: {
            address: {
                city: req.body.city,
                country: req.body.country,
                line1: req.body.line1,
                line2: req.body.line2,
                postal_code: req.body.postal_code,
                state: req.body.state
            },

            business_name: req.body.business_name,
            business_tax_id: req.body.business_tax_id,
            dob: {
                day: req.body.day,
                month: req.body.month,
                year: req.body.year
            },

            first_name: req.body.first_name,
            last_name: req.body.last_name,
            ssn_last_4: req.body.ssn_last_4,
            "type": req.body.type
        }

    }, function(err, account) {
            // asynchronously called
            if (err != null){
                res.send(err)

            } else {
                console.log("merchant created.");
                // res.send(account);
                createBankToken(account.id, res, req.body.country, "usd", req.body.account_holder_name,
                    req.body.type, req.body.routing_number, req.body.account_number);
            }
        });
});

/*functions */

function createBankToken(id, res, country, currency, account_holder_name,
                         account_holder_type, routing_number, account_number){
    stripe.tokens.create({
        bank_account: {
            country: country,
            currency: currency,
            account_holder_name: account_holder_name,
            account_holder_type: account_holder_type,
            routing_number: routing_number,
            account_number: account_number
        }
    }, function(err, token) {
        // asynchronously called

        if (err != null){
            res.send(err);
        } else {
            console.log("bank token created");
            createExternalAccount(token, res, id)
        }
    });
}

function createExternalAccount(token, res, id){
    stripe.accounts.createExternalAccount(
        id,
        {external_account: token.id},
        function(err, bank_account) {
            // asynchronously called
            if (err != null){
                res.send(err);
            } else {
                console.log("external account created");
                res.send(bank_account);
            }
        }
    );
}

//
module.exports = router;