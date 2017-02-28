/**
 * Created by d_innovator on 2/28/17.
 */


var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {

    res.render('myEvent', {});

});

module.exports = router;