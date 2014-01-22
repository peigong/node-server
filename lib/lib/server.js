var express   = require('express');
var _         = require('lodash');
var fs        = require('fs');
var http      = require('http');
var ModuleManager   = require('./module_manager.js');


module.exports = function Server(options) {
    var app = express();

    var mode = 'pro';
    if (options.hasOwnProperty('mode')) {
        mode = options['mode'];
    };

    app.set('mode', mode);

    this.start = function (cfg) {
        cfg = cfg || {};
        var defaults = { port: 4444 };
        var settings = _.extend({}, defaults, cfg);

        //扫瞄模块信息
        var manager = new ModuleManager(fs.realpathSync('.'), '../modules');
        //加载模块中间件
        manager.applyMiddleware(app);

        app.use(express.bodyParser());
        app.use(express.compress());
        app.use(express.methodOverride());
        app.use(app.router);
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
        node.listen(settings.port || null);

        console.log('Serving at port:' + (settings.port || ''));
    };

    return this;
};

