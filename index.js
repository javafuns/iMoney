var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/index.html'));
});


server.listen(8080, '127.0.0.1', () => {
    console.log('Listening at: http://localhost:8080');
});

io.listen(server).on('connection', function (socket) {
    socket.on('message', function (msg) {
        console.log('A request received: ', msg); 
        socket.broadcast.emit('message', msg);
    });
});
