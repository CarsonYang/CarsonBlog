var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
    for (var i = 0; i < numCPUs; i++) {
        worker = cluster.fork();
        console.log('worker：%d running...', worker.process.pid);
    }
} else {
    require('./bin/www');
}

cluster.on('exit', function (worker, code, signal) {
    if (code !== 0) {
        console.error('worker：%d wrongly exit（%s），restart after 30 seconds', worker.process.pid, signal || code);
        setTimeout(function () {
            var new_worker = cluster.fork();
            console.log('worker：%d running...', new_worker.process.pid);
        },30000);
    } else {
        console.log('worker：%d exit ！', worker.process.pid);
    }
});