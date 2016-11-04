const path = require('path'),
    Chat = require('../app/models/chat');

module.exports = function(app, passport) {
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname + '/../views/login.html'));
    });
    app.get('/profile', isLoggedIn, (req, res) => {
        /*res.sendFile(path.join(__dirname + '/../views/profile.html'), {
            user : req.user
        });*/
        res.json({
            user: req.user
        });
    });
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));
    app.get('/auth/google/callback', passport.authenticate('google', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }));
    app.get('/room', function(req, res) {
        Chat.find({
            'room': req.query.room.toLowerCase()
        }).exec(function(err, msgs) {
            res.json(msgs);
        });
    });
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }));
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }));
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
}