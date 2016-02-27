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

router.post('/createMerchant', function (req, res) {

    stripe.accounts.create({
        managed: true,
        country: 'US',
        business_name: req.body.business_name,
        email: req.body.email,
        //account: req.body.account,
        account_holder_name: req.body.account_holder_name,
        routing_number: req.body.routing_number,
        city: req.body.city,
        line1: req.body.line1,
        postal_code: req.body.postal_code,
        state: req.body.state,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        type: req.body.type,

        /*external_accounts: {

            data: [
                {



                }
            ]
        }*/

    }, function(err, account) {
        // asynchronously called
        if (err != null){
            res.send(err)

        } else {
            res.send(account);
        }
    });

});

module.exports = router;