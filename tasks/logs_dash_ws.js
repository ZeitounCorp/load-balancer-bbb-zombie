const follow = require('text-file-follower');
const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 5588 });

// Create a watcher for logfile
const follower = follow('/var/log/syslog', { persistent: true });

server.on('connection', function connection(ws) {
  follower.on('line', async function (filename, line) {
    ws.send(line);
  });
});
