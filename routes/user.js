/**
 * Created by macmini on 3/25/17.
 */


var express = require('express');
var router = express.Router();

router.get('/:id', function (req, res, next) {

   // console.log();
   // res.send();

    res.render('user', {user: req.params.id});

});

module.exports = router;