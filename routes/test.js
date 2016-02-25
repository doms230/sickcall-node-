/**
 * Created by macmini on 2/24/16.
 */

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/testthis', function (req, res) {
   var yo = req.body;

    res.send(yo);

});

module.exports = router;