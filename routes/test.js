/**
 * Created by macmini on 2/24/16.
 */

var express = require('express');
var router = express.Router();





/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');

   /* var newUser = Test({
        name: 'Peter Quill',
        username: 'starlord55',
        password: 'password',
        admin: true
    });

// save the user
    newUser.save(function(err) {
        if (err) throw err;

        console.log('User created!');
    });*/
});



module.exports = router;