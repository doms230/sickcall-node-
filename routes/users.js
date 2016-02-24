var express = require('express');
var router = express.Router();
var stripe = require('stripe')('sk_test_HSpPMwMkr1Z6Eypr5MMldJ46');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.all('/create', function (req, res) {

  var merchantInfo = req.body;
  res.send(merchantInfo);

   /*stripe.accounts.create(
      {
        email: "",
        country: "US",
        managed: true,

      }, function (err, account) {
        if(err != null){
          res.send(err);
        } else {
          res.send(account);
        }
      }
  );*/

  //res.send(response)

});




module.exports = router;
