var fs  = require('fs');
var _ = require('lodash');
var path  = require('path');

/**
* 系统配置管理器。
* @param {ServerMode} mode 服务器运行模式。
*/
function ConfigManager(mode){
    this.mode = mode;
    this.config = {};
    this.merge(this.getDefaultConfig());
    this.initialise(mode);
}
ConfigManager.prototype = {
    /**
    * 初始化。
    * @param {ServerMode} mode 服务器运行模式。
    */
    initialise: function(mode){
        var config_path = path.normalize([__dirname, '..', 'config', ''].join(path.sep));
        var config_file = [config_path, mode, '.json'].join('');
        if (fs.statSync(module).isFile()) {
            var config = require(config_file);
            this.merge(config);
        }
    },

    /**
    * 合并配置数据。
    * @param {JSON} config 需要合并的配置。
    */
    merge: function(config){
        _.merge(this.config, config);
    },

    /**
    * 获取默认配置。
    */
    getDefaultConfig: function(){
        return {
            "app": {
                "http_port": "4444",
                "https_port": 0,
                "access_log": "",
                "error_log": ""
            }
        };
    },

    /**
    * 获取当前配置。
    */
    getConfig: function(){
        return this.config;
    }
};

module.exports = ConfigManager;
