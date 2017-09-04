var express = require('express');
var app = express();
var http = require('http');
var mongoose = require('mongoose');

  var port = normalizePort(process.env.PORT || '5000');
  app.set('port', port);

  /**
   * Create HTTP server.
   */

  var server = http.createServer(app);
