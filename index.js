const express = require('express'),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    mongoose = require('mongoose'),
    db = require('./config/db.js'),
    passport = require('passport'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session');

mongoose.connect(db.url);

require('./config/passport')(passport);

app.use(express.static('public'));
app.use(session({
  secret: 'sdts5werfDeFi9',
  resave: true,
  saveUninitialized: true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());

require('./app/routes.js')(app, passport);

require('./config/chat')(io);

http.listen(3333, () => {
  console.log('listening localhost:3333');
});
