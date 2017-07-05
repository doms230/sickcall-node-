/**
 * Created by d_innovator on 5/14/16.
 */

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('error', { message: 'Express' });
});

module.exports = router;