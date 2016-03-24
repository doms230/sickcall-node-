var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongodb = require("mongodb");
var ParseServer = require('parse-server').ParseServer;
var stripe = require("stripe")(
    "sk_test_HSpPMwMkr1Z6Eypr5MMldJ46"
);
var mongoose = require('mongoose');

var routes = require('./routes/index');
var test = require('./routes/test');
var merchants = require('./routes/merchants');
var payments = require('./routes/merchants');
var app = express();

var api = new ParseServer({
  databaseURI: 'mongodb://heroku_8b6h0nrz:89j3qh02svfu720n4nkl81df54@ds015849.mlab.com:15849/heroku_8b6h0nrz', // Provide an absolute path
  appId: 'O9M9IE9aXxHHaKmA21FpQ1SR26EdP2rf4obYxzBF',
  masterKey: 'lykNp62jc700RfU3EOr0WRe8ZCZJ4kiD4ZI4FRaZ', // Keep this key secret!
  fileKey: '20137ff7-4160-41ee-bc18-1c2bf416e433',
  serverURL: 'https://hiikey.herokuapp.com' // Don't forget to change to https if needed
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/test', test);
app.use('/merchants', merchants);
app.use('/payments', payments);
app.use('/parse', api);

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
