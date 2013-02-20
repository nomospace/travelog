var routes = require('./routes');
var user = require('./routes/user');
var config = require('./config');
var http = require('http');
var path = require('path');
var express = require('express');
var less = require('less-middleware');
var app = express();
var appRoot = './' || __dirname;
var port = config.port;

app.configure('development', function() {
  app.set('port', port);
  app.set('views', appRoot + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
//  app.use(express.logger('dev'));
  app.use(express.compress());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser(config.authCookieName));
  app.use(express.session({secret: config.sessionSecret}));
  app.use(express.static(path.join(appRoot, 'public')));
  app.use(less({src: appRoot + '/public'}));
  app.use(user.authUser);
  app.use(app.router);
  app.locals({'title': config.name});
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

app.configure('development', function() {
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.get('/', routes.index);
app.get('/user/:uid/tours', user.showTours);
app.get('/user/:uid/tour/create', user.createTour);
app.get('/user/:uid/tour/:tid', user.showTour);
app.get('/user/:uid/tour/:tid/edit', user.editTour);
app.get('/login', user.login);
app.post('/login', user.doLogin);

http.createServer(app).listen(port, function() {
  console.log(config.host + ':' + config.port);
});
