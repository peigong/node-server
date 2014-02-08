var fs  = require('fs');
var path  = require('path');

/**
* Node-Server框架下的模块管理器。
* @param {String} modules 服务器模块所在的路径。
*/
function ModuleManager(modules) {
    modules = modules || 'modules';
    this.middleware = [];
    this.routes = [];
    this.initialise(modules);
}
ModuleManager.prototype = {
    /**
    * 初始化。
    * @param {String} modules 服务器模块的安装路径。
    */
    initialise: function(modules){
        modules = path.normalize(path.join(__dirname, '..', modules));
        var middleware = 'middleware';
        var routes = 'routes';
        list = fs.readdirSync(modules);
        for (var i = 0; i < list.length; i++) {
            var module = path.join(modules, list[i]);
            this.middleware = this.middleware.concat(this.scanModule(module, middleware));
            this.routes = this.routes.concat(this.scanModule(module, routes));
        };
    },

    /**
    * 扫瞄特定模块下的路由、中间件等配件。
    * @param {String} module 服务器模块的路径。
    * @param {String} part 路由、中间件等配件所在的路径。
    */
    scanModule: function(module, part) {
        var result = [];
        if (fs.statSync(module).isDirectory()) {
            var list = fs.readdirSync(path.join(module, part));
            for (var i = 0; i < list.length; i++) {
                var file_path = path.join(module, part, list[i]);
                if (fs.statSync(file_path).isFile()) {
                    result.push(file_path);
                }
            };
        };
        return result;
    },

    /**
    * 安装模块的路由、中间件等配件。
    * @param {Express}  app Express实例。
    * @param {String}   parts 路由、中间件等配件的路径。
    */
    applyModule: function(app, parts){
        for (var i = 0; i < parts.length; i++) {
            var module = require(parts[i]);
            module(app);
        };
    },

    /**
    * 安装模块的中间件配件。
    * @param {Express}  app Express实例。
    */
    applyMiddleware: function(app) {
        this.applyModule(app, this.middleware);
    },

    /**
    * 安装模块的路由配件。
    * @param {Express}  app Express实例。
    */
    applyRoutes: function(app) {
        this.applyModule(app, this.routes);
    }
};

module.exports = ModuleManager;