exports.create = function(req, res) {
  res.render('create', {title: 'Riding-web create'});
};

exports.list = function(req, res) {
  res.render('list', {title: 'Riding-web list'});
};
