var express = require('express');
var app = express();
var http = require('http');
var mongoose = require('mongoose');

var server = app.listen(3000);
app.get('/', "ok");
