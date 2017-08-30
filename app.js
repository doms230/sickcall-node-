//Go to Parse-Dashboard/config.json for app crendtions with the dashboard jaunt

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
//var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var mongodb = require("mongodb");
var ParseServer = require('parse-server').ParseServer;
var ParseDashboard = require('parse-dashboard');
var mongoose = require('mongoose');

var routes = require('./routes/home');
var terms = require('./routes/terms');
//var iosapp = require('./routes/ios-app');

var payments = require('./routes/payments');
var posts = require('./routes/posts');
var notifications = require('./routes/notifications');
var webhooks = require('./routes/webhooks');

var app = express();
var api = new ParseServer({
  databaseURI: 'mongodb://heroku_32hqc6pd:ft9g25jdo63tt0n4tlqogq5khl@ds139242.mlab.com:39242/heroku_32hqc6pd',
  appId: 'O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF',
  masterKey: 'lykNp62jc700RfU3EOr0WRe8ZCZJ4kiD4ZI4FRaZ', // Keep this key secret!
  fileKey: '20137ff7-4160-41ee-bc18-1c2bf416e433',
  //serverURL: 'https://celecare.herokuapp.com/parse',
  serverURL: 'http://localhost:5000/parse',
  liveQuery: {
    classNames: ['Post']
  },
 /*push: {
    ios: [
      {
       // pfx:'productionPushCert-aug11-16.p12',
       cert: 'pushProd.pem',
       //key: 'pushProd.pem',
        topic: 'com.sickcall.sickcall',
        production: true
      },
      {
       // pfx:'pushDevCert-Aug11-16.p12',
       cert: 'pushDev.pem',
       //key:'pushDev.pem',
        topic: 'com.sickcall.sickcall',
        production: false
      }
    ]
  },*/
  verifyUserEmails: true,
  emailVerifyTokenValidityDuration: 2 * 60 * 60, // in seconds (2 hours = 7200 seconds)
  preventLoginWithUnverifiedEmail: false, // defaults to false
  //publicServerURL: 'https://celecare.herokuapp.com/parse',
  publicServerURL: 'http://localhost:5000/parse',
  // Your apps name. This will appear in the subject and body of the emails that are sent.
  appName: 'Sickcall',
  // The email adapter
  emailAdapter: {
    module: 'parse-server-simple-mailgun-adapter',
    options: {
      // The address that your emails come from
      fromAddress: 'noreply@hiikey.com',
      // Your domain from mailgun.com
      domain: 'reset.hiikey.com',
      // Your API key from mailgun.com
      apiKey: 'key-931116e92b651622b653efef865d7a66'
    }
  },
    passwordPolicy: {
    // Two optional settings to enforce strong passwords. Either one or both can be specified. 
    // If both are specified, both checks must pass to accept the password
    // 1. a RegExp object or a regex string representing the pattern to enforce 
    validatorPattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/, // enforce password with at least 8 char with at least 1 lower case, 1 upper case and 1 digit
    // 2. a callback function to be invoked to validate the password  
    validatorCallback: (password) => { return validatePassword(password) }, 
    doNotAllowUsername: true, // optional setting to disallow username in passwords
    maxPasswordHistory: 5, // optional setting to prevent reuse of previous n passwords. Maximum value that can be specified is 20. Not specifying it or specifying 0 will not enforce history.
    //optional setting to set a validity duration for password reset links (in seconds)
    resetTokenValidityDuration: 24*60*60, // expire after 24 hours
  }
});

var dashboard = new ParseDashboard({
  "apps": [{
    //"serverURL": 'https://celecare.herokuapp.com/parse', // Not localhost
   "serverURL": 'http://localhost:5000/parse',
    "appId": 'O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF',
    "masterKey": 'lykNp62jc700RfU3EOr0WRe8ZCZJ4kiD4ZI4FRaZ',
    "appName": "Sickcall",
    "production": true,
    "iconName": "logo.png"
  }],
  "users": [
    {
      "user":"d_innovator",
      "pass":"Letscre@tE1!"
    }
  ],
  "iconsFolder": "./public/images",
  "trustProxy": 1

});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//used for verifying signatures from stripe webhooks
//app.use(bodyParser.raw({type: "*/*"}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/terms', terms);
app.use('/notifications', notifications);
app.use('/parse', api);
app.use('/dashboard', dashboard);
//app.use('/app',iosapp);
app.use('/payments', payments);
app.use('/posts', posts);
app.use('/webhooks', webhooks);
//scripts

/*app.use(cookieSession({
  name: 'session',
  secret: "xxxxx",
  maxAge: 15724800000
}));*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
