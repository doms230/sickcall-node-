var express = require('express');
var router = express.Router();
var http = require('http');

var stripe = require("stripe")("sk_test_XjgzLWe3uty249H9iZ6YtzId");

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

var event_json; 
var subject; 

const msg = {
    to: 'dom@sickcallhealth.com',
    from: 'noreply@sickcallhealth.com',
    subject: subject,
    text: event_json
  };

router.get('/', function(req, res, next) {
   // sgMail.send(msg);
 });

router.post('/stripe', function(req, res, next){

   // let sig = req.headers["stripe-signature"];
   // let event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    /*var event_json = JSON.parse(req.body);
    res.send(200);*/
    subject = "Message from Stripe";
     event_json = req.body;
    console.log(event_json);
    sgMail.send(msg);

    //res.json({received: true});
    res.sendStatus(200);

 });

 module.exports = router;