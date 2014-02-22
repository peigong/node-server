var express   = require('express');
var _         = require('lodash');
var fs        = require('fs');
var path      = require('path');
var http      = require('http');
var ServerMode      = require('./mode.js');
var ConfigManager   = require('./config.js');
var ModuleManager   = require('./module.js');
var logger   = require('./logger.js');

/**
* Node-Server框架。
* @param {Array} options 初始化服务的选项，格式如：{mode: '', config: ''}。
*/
function Server(options) {
    var app = express();

    this.mode = options['mode'];
    app.set('mode', this.mode);

    this.config = new ConfigManager(this.mode, options['config']);

    /**
    * 启动WEB服务。
    * @param {Array} cfg 启动WEB服务的配置信息，将覆盖配置文件的配置。
    */
    this.start = function (cfg) {
        cfg = cfg || {};
        var settings = this.config.merge(cfg);

        // 配置全局LOG
        logger(app);

        //扫瞄模块信息
        var manager = new ModuleManager();
        //加载模块中间件
        manager.applyMiddleware(app);

        app.use(express.cookieParser());
        app.use(express.bodyParser());
        app.use(express.compress());
        app.use(express.methodOverride());
        app.use(app.router);

        //配置WEB服务接受的虚拟主机域名
        var vhosts = settings.app.vhosts;
        if (vhosts) {
            if (_.isString(vhosts)) {
                app.use(express.vhost(vhosts, app));
            };
            if (_.isArray(vhosts)) {
                for (var i = 0; i < vhosts.length; i++) {
                    app.use(express.vhost(vhosts[i], app));
                };
            };
        };

        //加载模块路由
        manager.applyRoutes(app);

        var node = http.createServer(app);
        node.listen(settings.app.http_port || null);

        console.log('Serving at port:' + (settings.app.http_port || ''));
    };

    return this;
};

module.exports = Server;