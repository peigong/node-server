var express   = require('express');
var _         = require('lodash');
var fs        = require('fs');
var path      = require('path');
var http      = require('http');
var ServerMode      = require('./server_mode.js');
var ConfigManager   = require('./config_manager.js');
var ModuleManager   = require('./module_manager.js');


module.exports = function Server(options) {
    var app = express();

    this.mode = ServerMode.PRO;
    if (options.hasOwnProperty('mode')) {
        this.mode = options['mode'];
    };

    app.set('mode', this.mode);
    this.config = new ConfigManager(this.mode);

    this.start = function (cfg) {
        cfg = cfg || {};
        var settings = this.config.merge(cfg);

        //扫瞄模块信息
        //TODO:modules路径暂时写死，未来改为可配置。
        var manager = new ModuleManager('modules');
        //加载模块中间件
        manager.applyMiddleware(app);

        app.use(express.bodyParser());
        app.use(express.compress());
        app.use(express.methodOverride());
        app.use(app.router);

        var access_log = path.normalize([__dirname, '..', settings.app.access_log].join(path.sep));
        var accessLogfile = fs.createWriteStream(access_log, {flags: 'a'});
        var error_log = path.normalize([__dirname, '..', settings.app.error_log].join(path.sep));
        var errorLogfile = fs.createWriteStream(error_log, {flags: 'a'});
        app.use(express.logger({stream: accessLogfile}));

        if (ServerMode.DEV === this.mode) {
            app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
        };

        if (ServerMode.PRO === this.mode) {
            app.error(function (err, req, res, next) {
                var meta = '[' + new Date() + '] ' + req.url + '\n';
                errorLogfile.write(meta + err.stack + '\n');
                next();
            });
        };

        app.use(function (err, req, res, next) {
            console.log(err.stack);
            res.send(500, 'Something broke!');
        });
        app.use(express.errorHandler({
            dumpExceptions: true,
            showStack: true
        }));

        // log verbosely
        app.use(express.logger(({ format: ':method :status :url' })));

        //加载模块路由
        manager.applyRoutes(app);

        var node = http.createServer(app);
        node.listen(settings.app.http_port || null);

        console.log('Serving at port:' + (settings.app.http_port || ''));
    };

    return this;
};

