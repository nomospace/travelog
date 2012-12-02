/*
 * 首页
 */

exports.index = function(req, res) {
  res.render('index', {'page': 'index'});
};
