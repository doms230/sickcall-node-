/**
 * Created by macmini on 3/25/17.
 */


var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
//"https://itunes.apple.com/us/app/hiikey/id1013280340?ls=1&mt=8"

    res.redirect("https://itunes.apple.com/us/app/hiikey/id1013280340?ls=1&mt=8")
});

module.exports = router;