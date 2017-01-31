/**
 * Created by d_innovator on 1/28/17.
 */

var express = require('express');
var router = express.Router();
var Parse = require('parse/node');

/* GET users listing. */
router.get('/', function(req, res, next) {
    //res.send('respond with a resource');

    res.render('login', {});
});

module.exports = router;