/**
 * Created by macmini on 4/12/16.
 */
var express = require('express');
var router = express.Router();
var http = require('http');

var parse = require("parse/node").Parse;
parse.initialize("O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF",
    "bctRQbnLCvxRIHaJTkv3gqhlwSzxjiMesjx8kEwo");


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('eventCode',{});
   /* var query = new parse.Query(parse.Installation);
    query.equalTo('userId', 'ios');
    parse.Push.send({
        where: query,
        data: {
            alert: 'Test',
            badge: 1,
            sound: 'default'
        }
    }, {
        useMasterKey: true,
        success: function () {
            console.log("asdf");
        },
        error: function (error) {
            // There was a problem :(
            console.log(error);
        }

    });*/
});

/*router.get('/:id', function(req, res, next) {
    //res.send(req.params.id)
});*/

module.exports = router;