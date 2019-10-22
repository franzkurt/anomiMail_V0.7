var querystring = require('querystring');
var http = require('http');
var express = require('express');

var app = express();
app.get('/', function (req, res) {
  var options = {
    host: 'localhost',
    port: 3000,
    path: '/api',
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  };
  var httpreq = http.request(options, function (response) {
    response.setEncoding('utf8');
    response.on('data', resp => {
      res.send("response: " + resp)
    });
    response.on('end', function() {
      res.end();
    })
  });
  httpreq.end();
});

app.listen(2000)
