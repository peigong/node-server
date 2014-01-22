var fs  = require('fs');
var path  = require('path');

function ModuleManager(root, modules_path) {
    this.middleware = [];
    this.routes = [];
    this.initialise(root, modules_path);
}
ModuleManager.prototype = {
    initialise: function(root, modules_path){
        modules_path = path.normalize(this.join([__dirname, modules_path]));
        var middleware = 'middleware';
        var routes = 'routes';
        modules = fs.readdirSync(modules_path);
        for (var i = 0; i < modules.length; i++) {
            var module = this.join([modules_path, modules[i]]);
            this.middleware = this.middleware.concat(this.scanModule(module, middleware));
            this.routes = this.routes.concat(this.scanModule(module, routes));
        };
    },

    scanModule: function(module, path) {
        var result = [];
        var modules = fs.readdirSync(this.join([module, path]));
        for (var i = 0; i < modules.length; i++) {
            result.push(this.join([module, path, modules[i]]));
        };
        return result;
    },

    applyModule: function(app, modules){
        for (var i = 0; i < modules.length; i++) {
            var module = require(modules[i]);
            module(app);
        };
    },

    applyMiddleware: function(app) {
        this.applyModule(app, this.middleware);
    },

    applyRoutes: function(app) {
        this.applyModule(app, this.routes);
    },

    join: function(arr){
        return arr.join(path.sep);
    }
};

module.exports = ModuleManager;