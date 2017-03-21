/**
 * Created by macmini on 2/23/17.
 */


var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {

    var objectId = "reg";
    console.log(req.query.e);

    if (req.query.e != null){
        objectId = req.query.e;
    }

    res.render('profile', {objectId: objectId});

});

module.exports = router;