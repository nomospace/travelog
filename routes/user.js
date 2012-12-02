// TODO validator ?
var sanitize = require('validator').sanitize;
var config = require('../config');
var crypto = require('crypto');

exports.create = function(req, res) {
  res.render('create', {title: 'create'});
};

exports.list = function(req, res) {
  res.render('list', {title: 'list'});
};

exports.login = function(req, res) {
  res.render('login', {title: 'login'});
};

exports.doLogin = function(req, res) {
  var name = sanitize(req.body.name).trim().toLowerCase();
  var pass = sanitize(req.body.pass).trim();
  var user = {name: name, pass: pass};
  // store session cookie
  genSession(user, res);
  // TODO
  res.locals({'currentUser': req.session.user});
  res.redirect('/create');
};

function genSession(user, res) {
  var authToken = encrypt(user.name + '\t' + user.pass, config.sessionSecret);
  // cookie 有效期30天
  res.cookie(config.authCookieName, authToken, {
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 30
  });
}

function encrypt(str, secret) {
  var cipher = crypto.createCipher('aes192', secret);
  var enc = cipher.update(str, 'utf8', 'hex');
  enc += cipher.final('hex');
  return enc;
}
