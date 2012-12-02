/**
 * 模块依赖以及 app 入口
 */

var routes = require('./routes');
var user = require('./routes/user');
var config = require('./config');
var http = require('http');
var path = require('path');
var express = require('express');
var app = express();
var appRoot = './' || __dirname;

app.configure(function() {
  app.set('port', config.port);
  app.set('views', appRoot + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session({secret: config.sessionSecret}));
  app.use(app.router);
  app.use(require('less-middleware')({src: appRoot + '/public'}));
  app.use(express.static(path.join(appRoot, 'public')));
});

app.configure('development', function() {
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/list', user.list);
app.get('/create', user.create);

http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});
