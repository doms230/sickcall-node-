/**
 * Created by macmini on 5/17/16.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('agreement',{});
});

module.exports = router;