var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
  console.log('user connected');
  socket.broadcast.emit('chat message', '1 new user connected');
  socket.on('login', (user, pass) => {

  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat message', msg => {
    console.log('send message:' + msg);
    io.emit('chat message', msg)
  });
  socket.on('login', (user, pass) => {

  });
});
http.listen(3333, () => {
  console.log('listening localhost:3333');
});