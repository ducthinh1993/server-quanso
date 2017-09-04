var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
//var cookieParser = require('cookie-parser'); //"cookie-parser": "~1.3.5",
var bodyParser = require('body-parser');

var index = require('./routes/index');
var admin = require('./routes/admin');
var company = require('./routes/company');
var user = require('./routes/user');
var auth = require('./routes/auth');
var group = require('./routes/group');
var customer  = require('./routes/customer');
var product  = require('./routes/product');
var work  = require('./routes/work');
var log  = require('./routes/log');
var money  = require('./routes/money');
var bill  = require('./routes/bill');
var warehouse  = require('./routes/warehouse');
var delivery  = require('./routes/delivery');
var pricenotify  = require('./routes/pricenotify');
var contract  = require('./routes/contract');
			// test thử ko xóa.....
var notify = require('./routes/notify');
var fcm = require('./routes/fcmnotify');
			// test thử ko xóa.....
var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(__dirname + '/public/images/'));
app.use('/avatar', express.static(__dirname + '/public/avatar/'));


// app.use('/', index);
app.use('/v1/fcm', fcm);
app.use('/v1/admin', admin);
app.use('/', auth); // 12.06.20.17 tắt auth
app.use('/user', user);
app.use('/company',company);
app.use('/group',group);
app.use('/customer',customer);
app.use('/product',product);
app.use('/work',work);
app.use('/log',log);
app.use('/money',money);
app.use('/bill',bill);
app.use('/pricenotify',pricenotify);
app.use('/contract',contract);
app.use('/delivery',delivery);
app.use('/warehouse',warehouse);


// catch 404 and forward to error handler
app.use(function(req, res, next) { 
  res.header("Access-Control-Allow-Origin", "*");   
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler - will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
  });
}

// production error handler - no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;
