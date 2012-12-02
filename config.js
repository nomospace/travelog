module.exports = {
  debug: true,
  name: 'riding-web',
  description: '一个骑行网站',
  version: '0.0.1',

  sessionSecret: 'riding',
  authCookieName: 'riding',
  host: '127.0.0.1',
  port: 3001,

  db: 'mongodb://127.0.0.1/riding'
};
