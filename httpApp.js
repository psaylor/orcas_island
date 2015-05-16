var express = require('express');
var path = require('path');
var morgan = require('morgan');
var fs = require('fs');
var logger = require('./lib/logger');

var app = express();

/* Set up an http app that just redirects to the https version */

app.get('*', function (req, res) {
  logger.info('Http app got request; will redirect', {
    url: req.url,
    hostname: req.hostname,
    port: req.app.get('port'),
  });
  var port = app.get('port') - 1000;
  res.redirect('https://' + req.hostname + ':' + port + req.url);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


if (app.get('env') === 'development') {
    logger.info('Configuring app for development:', app.get('env'));
    // development error handler
    // will print stacktrace
    app.use(function(err, req, res, next) {
        logger.error("Dev error", err);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });

    app.locals.production = false;

} else {
    // configure production settings
    logger.info('Configuring app for production:', app.get('env'));
    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        logger.error("Prod err", err);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });

    app.enable('trust proxy');
    app.locals.production = true;
}

module.exports = app;
