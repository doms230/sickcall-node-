/**
 * Created by macmini on 2/24/16.
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

router.post('/testthis', function (req, res) {

   stripe.accounts.create({
        managed: true,
        country: 'US',
        email: req.body.email

    }, function(err, account) {
        // asynchronously called
        if (err != null){

        } else {
            res.send(account);
        }
    });

});

module.exports = router;