'use strict';

var express = require('express');
var port = 3000;
var app = express();
var path = require('path');
var _ = require('underscore');


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/carShop');
var db = mongoose.connection;
db.on('error', function(err) {
  console.error('mongoose 连接错误: ' + err.message + ' (' + err.name + ')');
});

var morgan = require('morgan');
app.use(morgan('dev'));

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(session({
  name: 'carshopsession',
  secret: 'carshopkey',
  resave: false,
  saveUninitialized: false,
  cookie:{maxAge:3 * 24 * 60 * 60 * 1000},
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
  })
}));

// var sequelizeService = require('./sequelizeService');


app.use(express.static(path.join(__dirname, '../client')));

app.locals.moment = require('moment');
app.locals.appTitle = '汽车商城';

app.set('views', __dirname + '/views/pages');
app.set('view engine', 'jade');

app.locals.pretty = true;

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));



require('./routes')(app);


app.listen(port);

console.log('汽车商城网站服务已启动,监听端口号:' + port);

if (process.env.NODE_ENV === 'development') {

  mongoose.set('debug', true);

  require('express-debug')(app, {
    depth: 4,
    panels: ['locals', 'request', 'session', 'template', 'software_info', 'nav']
  });

  var errorhandler = require('errorhandler');
  app.use(errorhandler);

}
