/**
* 负责在命令行下启动服务。
*/

var Server = require('../lib/server.js');

// 支持桩（stub）、开发（dev）和产品（pro）三种启动模式。
var server = new Server({ mode: 'stub'});

server.start();