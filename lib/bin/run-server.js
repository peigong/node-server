/**
* 负责在命令行下启动服务。
*/
var Server      = require('../lib/server.js');
var ServerMode  = require('../lib/server_mode.js');
var ServerCluster  = require('../lib/server_cluster.js');

// 支持桩（stub）、开发（dev）和产品（pro）三种启动模式。
var mode = 'dev';
if (ServerMode.check(mode)) {
    var server = new Server({ 'mode': mode});
    new ServerCluster(server);
}else{
    console.log('stop!');
}
