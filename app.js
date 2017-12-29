//Go to Parse-Dashboard/config.json for app crendtions with the dashboard jaunt

/* used to create config files 
echo "export SENDGRID_API_KEY='YOUR_API_KEY'" > sendgrid.env
echo "sendgrid.env" >> .gitignore
source ./sendgrid.env
*/

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
var advisor = require('./routes/advisor');
var iosapp = require('./routes/ios-app');

var payments = require('./routes/payments');
var posts = require('./routes/posts');
var notifications = require('./routes/notifications');
var webhooks = require('./routes/webhooks');
var signup = require('./routes/signup');
var nurses = require('./routes/nurses');
var ask = require('./routes/ask');
var about = require('./routes/about');
var stats = require('./routes/stats');
var support = require('./routes/support');
var app = express();
var api = new ParseServer({
  databaseURI: [Database URI],
  appId: [App id],
  masterKey: [master key], // Keep this key secret!
  fileKey: [file key],
  serverURL: 'https://celecare.herokuapp.com/parse',
  //serverURL: 'http://localhost:5000/parse',
  liveQuery: {
    classNames: ['Post']
  },
 push: {
    ios: [
      {
        pfx:'push-sickcall.p12',
        passphrase:[password],
       //cert: 'pushProd.pem',
       //key: 'pushProd.pem',
       topic: 'com.sickcallc.sickcall',
        production: true
      },
      {
      pfx:'push-sickcall.p12',
      passphrase: [password],
       //cert: 'pushDev.pem',
       //key:'pushDev.pem',
        topic: 'com.sickcallc.sickcall',
        production: false
      },
      {
        pfx:'push-advisor.p12',
        passphrase:[password],
       //cert: 'pushProd.pem',
       //key: 'pushProd.pem',
       topic: 'com.sickcallc.sickcalladvisor',
        production: true
      },
      {
      pfx:'push-advisor.p12',
      passphrase: [password],
       //cert: 'pushDev.pem',
       //key:'pushDev.pem',
        topic: 'com.sickcallc.sickcalladvisor',
        production: false
      }
    ]
  },
  verifyUserEmails: true,
  emailVerifyTokenValidityDuration: 2 * 60 * 60, // in seconds (2 hours = 7200 seconds)
  preventLoginWithUnverifiedEmail: false, // defaults to false
  publicServerURL: 'https://celecare.herokuapp.com/parse',
  //publicServerURL: 'http://localhost:5000/parse',
  // Your apps name. This will appear in the subject and body of the emails that are sent.
  appName: 'Sickcall',
  // The email adapter
  emailAdapter: {
    module: 'parse-server-simple-mailgun-adapter',
    options: {
      // The address that your emails come from
      fromAddress: 'noreply@sickcallhealth.com',
      // Your domain from mailgun.com
      domain: 'reset.sickcallhealth.com',
      // Your API key from mailgun.com
      apiKey: [api-key]
    }
  }/*,
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
    }*/
});

var dashboard = new ParseDashboard({
  "apps": [{
    "serverURL": 'https://celecare.herokuapp.com/parse', // Not localhost
   //"serverURL": 'http://localhost:5000/parse',
    "appId": [app id],
    "masterKey": [master key],
    "appName": "Sickcall",
    "production": true,
    "iconName": "1080-noback.png"
  }],
  "users": [
    {
      "user":"d_innovator",
      "pass":[password]
    }
  ],
  "iconsFolder": "./public/images/",
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
app.use('/app',iosapp);
app.use('/payments', payments);
app.use('/posts', posts);
app.use('/webhooks', webhooks);
app.use('/advisor', advisor);
app.use('/signup', signup);
app.use('/nurse', nurses);
app.use('/ask', ask);
app.use('/about', about);
app.use('/stats', stats);
app.use('/support', support);
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
