var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var configDB = require('./config/db.js');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

mongoose.connect(configDB.url);

require('./config/passport')(passport);

app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded());
app.use(passport.initialize());
app.use(passport.session());

require('./app/routes.js')(app, passport);
/*
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
});*/
http.listen(3333, () => {
  console.log('listening localhost:3333');
});
