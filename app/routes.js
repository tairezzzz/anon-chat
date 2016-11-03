var path = require('path');

module.exports = function(app, passport) {
    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname + '/../views/login.html'));
    });
    app.get('/profile', function(req, res) {
        /*res.sendFile(path.join(__dirname + '/../views/profile.html'), {
            user : req.user
        });*/
        res.json({
            user: req.user
        })
    });
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }));
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
}