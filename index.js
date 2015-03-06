var express = require('express');
var https = require('https');
var http = require('http');

var app = express();
var http_port = 80;
var https_port = 443;

app.get('/', function(req, res) {
    res.send('It works!');
});

http.createServer(app).listen(http_port);
https.createServer(app).listen(https_port);
console.log('Listening on ports ', http_port, https_port);