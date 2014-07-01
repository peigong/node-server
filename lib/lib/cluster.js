var os = require('os'),
  cluster = require('cluster');

var fs = require('fs'),
    path = require('path');
    
/**
* 支持多核和故障恢复。
* 参考《Node.js开发指南》
* @param {Server} server Node.js服务器实例。
*/
function Cluster(server){
  // 獲取 CPU 的數量
  var numCPUs = os.cpus().length;
  var pidfile = path.normalize(path.resolve(__dirname, '..', 'server.pid'));
  var pidlog = path.normalize(path.resolve(__dirname, '..', 'pid.log'));

  var workers = {};
  if (cluster.isMaster) {
    //fs.writeFileSync(pidfile, process.pid);
    fs.appendFileSync(pidlog, 'master:' + process.pid + '\n');
    // 主進程分支
    cluster.on('death', function (worker) {
      // 當一個工作進程結束時，重啓工作進程
      delete workers[worker.pid];
      worker = cluster.fork();
      workers[worker.pid] = worker;
    });
    // 初始開啓與 CPU 數量相同的工作進程
    for (var i = 0; i < numCPUs; i++) {
      var worker = cluster.fork();
      workers[worker.pid] = worker;
    }
  } else {
    fs.appendFileSync(pidlog, 'worker:' + process.pid + '\n');

    // 工作進程分支，啓動服務器
    server.start();
  }

  // 當主進程被終止時，關閉所有工作進程
  process.on('SIGTERM', function () {
    for (var pid in workers) {
      process.kill(pid);
    }
    if(fs.existsSync(pidfile)){
      fs.unlinkSync(pidfile);
    }
    process.exit(0);
  });
}

module.exports = Cluster;
