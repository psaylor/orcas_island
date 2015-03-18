var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var rr = require('ractive-render');
var RactiveExpress = require('ractive-express');
var layout = require('express-layout');
var browserify = require('browserify-middleware');

var routes = require('./routes/index');
var stories = require('./routes/stories');

var app = express();

// view engine setup
var context = new RactiveExpress();
app.engine('html', context.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use('/views', express.static(path.join(__dirname, 'views')));
// rr.config({autoloadPartials: true});
app.use(layout());
app.use(express.static(path.join(__dirname, 'public'))); // TODO explain what this means for how you access files in public directory (don't prefix them with)
app.get('/js/bundle.js', browserify(['lodash', 'async', 'ractive-express']));

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/', routes);
app.use('/stories', stories);

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
