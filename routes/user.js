// TODO validator ?
var sanitize = require('validator').sanitize;
var config = require('../config');
var crypto = require('crypto');
// TODO node-canvas
// http://cnodejs.org/topic/4f939c84407edba2143c12f7
//var Canvas = require('canvas');

// TODO node-weibo
// https://github.com/fengmk2/node-weibo
//var Weibo = require('weibo');

exports.showTour = function(req, res) {
  res.render('tour-setup', {'page': 'tour-setup'});
};

exports.createTour = function(req, res) {
  res.render('tour-setup', {'page': 'tour-setup', 'tag': 'create'});
};

exports.editTour = function(req, res) {
  res.render('tour-setup', {'page': 'tour-setup', 'tag': 'edit'});
};

exports.showTours = function(req, res) {
  res.render('tours', {'page': 'tour'});
};

exports.login = function(req, res) {
  res.render('login', {'page': 'login'});
};

exports.doLogin = function(req, res) {
  var name = sanitize(req.body.name).trim().toLowerCase();
  var pass = sanitize(req.body.pass).trim();
  var user = {name: name, pass: pass};
  // store session cookie
  genSession(user, res);
  res.locals({'User': req.session.user = user});
  res.redirect('/user/1/tours');
};

exports.authUser = function(req, res, next) {
  if (req.session.user) {
    res.locals({'User': req.session.user});
  }
  return next();
};

function genSession(user, res) {
  var authToken = encrypt(user.name + '\t' + user.pass, config.sessionSecret);
  // cookie 有效期7天
  res.cookie(config.authCookieName, authToken, {
    path: '/',
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    secure: true
  });
}

function encrypt(str, secret) {
  var cipher = crypto.createCipher('aes192', secret);
  var enc = cipher.update(str, 'utf8', 'hex');
  enc += cipher.final('hex');
  return enc;
}

