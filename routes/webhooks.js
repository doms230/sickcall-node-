var express = require('express');
var router = express.Router();
var http = require('http');

var stripe = require("stripe")("sk_test_XjgzLWe3uty249H9iZ6YtzId");

var endpointSecret = "whsec_hXJoQxpyCuEzpqaoLFVcCDGAyCIzdLNE";

router.get('/', function(req, res, next) {
 
 });

router.post('/stripe', function(req, res, next){

   // let sig = req.headers["stripe-signature"];
   // let event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    /*var event_json = JSON.parse(req.body);
    res.send(200);*/
    var event_json = JSON.parse(req.body);
    console.log(event_json)

    //res.json({received: true});
    res.send(200);

 });

 module.exports = router;