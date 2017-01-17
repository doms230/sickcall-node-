var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongodb = require("mongodb");
var ParseServer = require('parse-server').ParseServer;

var mongoose = require('mongoose');

var routes = require('./routes/home');
var test = require('./routes/test');
var terms = require('./routes/terms');
var notifications = require('./routes/notifications');
var videos = require('./routes/videos');
var invites = require('./routes/invites');
var events = require('./routes/events');

var app = express();
var api = new ParseServer({
  databaseURI: 'mongodb://heroku_rfhfq2b5:u7q5lg6q7fujm6gldpmpeqk2k6@ds153345-a0.mlab.com:53345,ds153345-a1.mlab.com:53345/heroku_rfhfq2b5?replicaSet=rs-ds153345',
  appId: 'O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF',
  masterKey: 'lykNp62jc700RfU3EOr0WRe8ZCZJ4kiD4ZI4FRaZ', // Keep this key secret!
  fileKey: '20137ff7-4160-41ee-bc18-1c2bf416e433',
  serverURL: 'https://hiikey.herokuapp.com/parse',
  //serverURL: 'http://localhost:3000/parse',
  liveQuery: {
    classNames: ['Chat', 'PublicPost']
  },
  push: {
    ios: [
      {
        pfx:'productionPushCert-aug11-16.p12',
        bundleId: 'com.socialgroupe.hiikey',
        production: true
      },
      {
        pfx:'pushDevCert-Aug11-16.p12',
        bundleId: 'com.socialgroupe.hiikey',
        production: false
      }
    ]
  }


 /* verifyUserEmails: true,
  emailVerifyTokenValidityDuration: 2 * 60 * 60, // in seconds (2 hours = 7200 seconds)
  preventLoginWithUnverifiedEmail: false, // defaults to false
  publicServerURL: 'https://hiikey.herokuapp.com/parse',
  // Your apps name. This will appear in the subject and body of the emails that are sent.
  appName: 'Hiikey',
  // The email adapter
  emailAdapter: {
    module: 'parse-server-simple-mailgun-adapter',
    options: {
      // The address that your emails come from
      fromAddress: 'noreply@hiikey.com',
      // Your domain from mailgun.com
      domain: 'app5de970d9d00a40e5b5eeb940170e17f6.mailgun.org',
      // Your API key from mailgun.com
      apiKey: 'key-e026a6336d9f9c1a3eacaa54f2175703'
    }
  },
  push: {
    ios: [
      {
        pfx: 'productionPushCert-aug11-16.p12',
        bundleId: 'com.socialgroupe.hiikey',
        production: true
      }
    ]
  }*/
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser("cookei"));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/test', test);
app.use('/terms', terms);
app.use('/notifications', notifications);
app.use('/videos', videos);
app.use('/parse', api);
app.use('/invites',invites);
app.use('/events', events);

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
