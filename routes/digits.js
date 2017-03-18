/**
 * Created by macmini on 3/18/17.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var nconf = require('nconf');
var url = require('url');
var request = require('request');
var authorization = require('auth-header');

/**
 * GET Cannonball home page.
 */
router.get('/', function (req, res, next) {
    res.render('index', {
        DIGITS_CONSUMER_KEY: 'IeV33K1YaqjI4ompRDHiDREH3',
        GA_TRACKING_ID: nconf.get('GA_TRACKING_ID')
    });
});

/**
 * POST Digits login.
 */
router.post('/digits', function (req, res) {
    var apiUrl = req.body['apiUrl'];
    var credentials = req.body['credentials'];
    var verified = true;
    var messages = [];

    // Get authorization header.
    var auth = authorization.parse(credentials);

    // OAuth authentication not provided.
    if (auth.scheme != 'OAuth') {
        verified = false;
        console.log('line 37: Invalid auth type.');
    }

    // Verify the OAuth consumer key.
    if (auth.params.oauth_consumer_key != 'IeV33K1YaqjI4ompRDHiDREH3') {
        verified = false;
        console.log('line 43: The Digits API key does not match.');
    }

    // Verify the hostname.
    var hostname = url.parse(req.body.apiUrl).hostname;
    if (hostname != 'api.digits.com' && hostname != 'api.twitter.com') {
        verified = false;
        console.log('line 50: Invalid API hostname.');
    }

    // Do not perform the request if the API key or hostname are not verified.
    if (!verified) {
        console.log("line 55: Not verified");
        return res.send({
            phoneNumber: "",
            userID: "",
            error: messages.join(' ')
        });
    }

    // Prepare the request to the Digits API.
    var options = {
        url: apiUrl,
        headers: {
            'Authorization': credentials
        }
    };

    // Perform the request to the Digits API.
    request.get(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Send the verified phone number and Digits user ID.

            var digits = JSON.parse(body);
            return res.send({
                phoneNumber: digits.phone_number,
                userID: digits.id_str,
                error: ''
            });
        } else {
            // Send the error.
            console.log("line 83: " + error.message);
            return res.send({
                phoneNumber: '',
                userID: '',
                error: error.message
            });
        }
    });
});

module.exports = router;