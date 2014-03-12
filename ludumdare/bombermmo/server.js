var http = require('http'),

//var playerPool = [];

io = require('socket.io'), // for npm, otherwise use require('./path/to/socket.io')

server = http.createServer(function(req, res)
{
    // your normal server code
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.end('<h1>Hello world</h1>');
});

server.listen(5000);

// socket.io
var socket = io.listen(server);

socket.on('connection', function(client)
{
    console.log('new connection turra maldita !');
  
    client.on('message', function(){
        console.log('send message')
        
        client.emit('message');
        
    });
  
  
    client.on('controls', function(){
        console.log('send message')
        
        client.emit('message');
        
    });
  
  
    client.on('disconnect', function(){
        console.log('disconnect')
    });
  
});