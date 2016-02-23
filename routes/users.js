var express = require('express');
var router = express.Router();
var stripe = require('stripe')('sk_test_HSpPMwMkr1Z6Eypr5MMldJ46');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/create', function (req, res) {
   stripe.accounts.create(
      {
        business_name: "sgi",
        country: "US",
        managed: true,

      }, function (err, account) {
        if(err != null){
          res.send(err);
        } else {
          res.send(account);
        }
      }
  );

  //res.send(response)

});




module.exports = router;
