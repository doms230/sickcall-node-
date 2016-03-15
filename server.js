var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var USERS_COLLECTION = "_users";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGOLAB_URI, function (err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    // Save database object from the callback for reuse.
    db = database;
    console.log("Database connection ready");

    // Initialize the app.
    var server = app.listen(process.env.PORT || 8080, function () {
        var port = server.address().port;
        console.log("App now running on port", port);
    });
});

// Users API ROUTES BELOW
// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
}

/*  "/_users"
 *    GET: finds all contacts
 *    POST: creates a new contact
 */

app.get("/_users", function(req, res) {
});

app.post("/_users", function(req, res) {

    var newUser = req.body;
    newUser.createDate = new Date();

    if (!(req.body.name)){
        handleError(res, "Invalid user input", "Must provide first or last name.", 400);
    }

    db.collection(USERS_COLLECTION).insertOne(newUser, function(err, doc){
        if (err){
            handleError(res, err.message, "Failed to create new user.");
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

app.get("/_users/:id", function(req, res) {
});

app.put("/_users/:id", function(req, res) {
});

app.delete("/_users/:id", function(req, res) {
});