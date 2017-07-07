/**
 * Created by macmini on 7/4/17.
 *
 * http://localhost:5000/payments/addCard?isCustomer=false&email=doms230@live.com
 */

var express = require('express');
var router = express.Router();
var http = require('http');

var stripe = require("stripe")(
    "sk_test_XjgzLWe3uty249H9iZ6YtzId"
);

router.get('/', function(req, res, next) {


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

    stripe.customers.create({
        email: req.params.email
    }).then(function(customer){

        res.send(customer);
        //saveCustomerId(userId, source.customer);

    }).catch(function(err) {
        res.send(err);
    });

});



/*function createCustomer( email, exp_month, exp_year, number, cvc, res){
}*/

module.exports = router;