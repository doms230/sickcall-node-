/**
 * Created by macmini on 2/24/16.
 */

var express = require('express');
var router = express.Router();
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var CONTACTS_COLLECTION = "contacts";




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

mongodb.MongoClient.connect('mongodb://hiikey:ihatemlab1!@ds015849.mlab.com:15849/heroku_8b6h0nrz', function (err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    // Save database object from the callback for reuse.
    db = database;
    console.log("Database connection ready");

});

function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
}

/*  "/contacts"
 *    GET: finds all contacts
 *    POST: creates a new contact
 */

router.get("/contacts", function(req, res) {
});

router.post("/contacts", function(req, res) {
    var newContact = req.body;
    newContact.createDate = new Date();

    if (!(req.body.firstName || req.body.lastName)) {
        handleError(res, "Invalid user input", "Must provide a first or last name.", 400);
    }

    db.collection(CONTACTS_COLLECTION).insertOne(newContact, function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to create new contact.");
        } else {
            res.status(201).json(doc.ops[0]);
        }
    });
});

/*  "/contacts/:id"
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */

router.get("/contacts/:id", function(req, res) {
});

router.put("/contacts/:id", function(req, res) {
});

router.delete("/contacts/:id", function(req, res) {
});



module.exports = router;