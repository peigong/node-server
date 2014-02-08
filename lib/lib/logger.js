/**
* 参考：http://blog.fens.me/nodejs-log4js/
*/
var path  = require('path');
var express    = require('express');
var log4js     = require('log4js');
var ServerMode = require('./mode.js');

var cwd = path.normalize(path.resolve(__dirname, '..'));
var log4js_config = path.resolve(cwd, 'config', 'log4js.json');
log4js.configure(log4js_config, { 'cwd': cwd});

var access_logger = log4js.getLogger('access');
var error_logger = log4js.getLogger('error');

module.exports = function(app){
  var mode = app.get('mode');
  var level = 'INFO';
  switch(mode){
    case ServerMode.STUB:
    case ServerMode.DEV:
      level = 'TRACE';
      break;
  }
  access_logger.setLevel(level);
  app.use(log4js.connectLogger(access_logger, { 'level': level }));

  app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
  }));
  app.use(function (err, req, res, next) {
    if (err) {
      var meta = '[' + new Date() + '] ' + req.url + '\n';
      error_logger.fatal(meta + err.stack + '\n');      
    };
    next();
  });
};