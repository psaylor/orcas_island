var express = require('express');
var https = require('https');
var http = require('http');

var xml2js = require('xml2js');

// var app = express();
// var http_port = 80;
// var https_port = 443;

// app.get('/', function(req, res) {
//     res.send('It works!');
// });

// http.createServer(app).listen(http_port);
// https.createServer(app).listen(https_port);
// console.log('Listening on ports ', http_port, https_port);

var xmlString = '<?xml version="1.0" encoding="UTF-8"?>' +
'<readable>'+
'<title>'+
'The Traveler and His Dog' +
'</title>' +
'</readable>';
var parser = new xml2js.Parser();
parser.parseString(xmlString, function(err, result) {
    console.log("Error:", err);
    console.log("result:", result);
});