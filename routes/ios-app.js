//

var express = require('express');
var router = express.Router();
var http = require('http');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('https://itunes.apple.com/us/app/sickcall/id1303791960?ls=1&mt=8');
});

module.exports = router;