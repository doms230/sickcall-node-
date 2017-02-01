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

    res.render('login', {});
    var currentUser = parse.User.current();
    if (currentUser) {
        // do stuff with the user

        console.log(currentUser);
    } else {
        console.log("not signed in")
    }
});

router.post('/signin', function(req, res){
    var username = req.body.username;
    var password = req.body.password;

    parse.User.logIn(username, password, {
        success: function(user) {
            // Do stuff after successful login.
            //console.log("signed in " + user );
            console.log('Cookies: ' + req.cookies);
            res.cookie("userToken" , user.getSessionToken(), { maxAge: 900000 });
            console.log("token: " + req.cookies.userToken);
            console.log("hey");
        },
        error: function(user, error) {
            // The login failed. Check error to see why.
            console.log(error);
        }
    });
});

module.exports = router;