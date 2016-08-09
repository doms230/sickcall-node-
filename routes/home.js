/**
 * Created by macmini on 4/12/16.
 */
var express = require('express');
var router = express.Router();
var http = require('http');
var options = {
    host: 'api.foursquare.com',
    port: 3000,
    path: '/v2/venues/search?categoryId=4bf58dd8d48988d1d6941735&near=Dallas,Tx&client_id=HD5QZLWSWAXSYY3H443MACUILH44YF0JXCPQNMWTKBEUTL42&client_secret=UVLOQ0I0PD5TORCTAJDLMCXJYNMECOVQKOOTQAIDNPNYE5J4&v=20160709'
};

var foursquare = require('node-foursquare-venues')('HD5QZLWSWAXSYY3H443MACUILH44YF0JXCPQNMWTKBEUTL42', 'UVLOQ0I0PD5TORCTAJDLMCXJYNMECOVQKOOTQAIDNPNYE5J4', '20160709');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home',{});
    foursquare.venue("4bf58dd8d48988d1d6941735", "Dallas,Tx", function (req, res) {


    });
});

module.exports = router;