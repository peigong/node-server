/**
* 负责在命令行下启动服务。
*/
var path      = require('path');
var Server      = require('../lib/server.js');
var ServerMode  = require('../lib/mode.js');
var Cluster  = require('../lib/cluster.js');
var Hook        = require('../lib/hook.js').Hook;
var execHook    = require('../lib/hook.js').execHook;

var nopt = require("nopt")
  , knownOpts = { "mode" : [String, null], "config" : [String, null] }
  , shortHands = { "m" : ["--mode"], "c" : ["--config"] }
  , parsed = nopt(knownOpts, shortHands, process.argv, 2)

/**
* 从key-value字典中检索。
* @param {Array} dict 查找的字典。
* @param {String} key 用于查找的键。
* @param {String} def 检索不到值时，提供的默认值。
*/
function getValue(dict, key, def){
    var result;
    if (dict.hasOwnProperty(key)) {
        result = dict[key];
    }else{
        result = def;
    }
    return result;
}

// 支持桩（stub）、开发（dev）和产品（pro）三种启动模式。
var mode = getValue(parsed, 'mode', ''),
    config = getValue(parsed, 'config', '../config');
if (ServerMode.check(mode)) {
    config = path.normalize(path.resolve(__dirname, '..', config));
    var options = { 'mode': mode, 'config': config };
    var server = new Server(options);
    new Cluster(server);
    // 触发服务器启动的钩子
    execHook(Hook.START, options);
}else{
    console.log('stop!');
}

