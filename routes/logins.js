/**
 * Created by d_innovator on 1/28/17.
 */

var express = require('express');
var router = express.Router();
var parse = require('parse/node');
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF", "bctRQbnLCvxRIHaJTkv3gqhlwSzxjiMesjx8kEwo");


/* GET users listing. */
router.get('/', function(req, res, next) {
    //res.send('respond with a resource');
    var ya = req.query.e;
    res.render('login', {objectId: ya });

});


module.exports = router;