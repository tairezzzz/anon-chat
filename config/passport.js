var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../app/models/user');
var auth = require('./auth');

module.exports = passport => {
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(err, user)));
    passport.use(new GoogleStrategy({
            clientID: auth.google.clientID,
            clientSecret: auth.google.clientSecret,
            callbackURL: auth.google.callbackURL,
        },
        function(token, refreshToken, profile, done) {
            process.nextTick(function() {
                User.findOne({ 'google.id' : profile.id }, function(err, user) {
                    if (err) {
                        console.log(err);
                        return done(err);
                    }
                    if (user) {
                        console.log('google user exists');
                        return done(null, user);
                    } else {
                        var newUser = new User();
                        newUser.google.id = profile.id;
                        newUser.google.token = token;
                        newUser.google.name = profile.displayName;
                        newUser.google.email = profile.emails[0].value;
                        newUser.save(function(err) {
                            if (err) throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }
    ));
    passport.use('local-login', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {
            User.findOne({ 'local.email' :  email }, function(err, user) {
                if (err) {
                    console.log(err);
                    return done(err);
                }
                if (!user) {
                    console.log('user not exists');
                    return done(null, false);
                }
                if (!user.validPassword(password)) {
                    console.log('password');
                    return done(null, false);
                }
                return done(null, user);
            });

        }));

    passport.use('local-signup', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {
            process.nextTick(function() {
                User.findOne({'local.email':  email}, function(err, user) {
                    if (err) {
                        console.log(err);
                        return done(err);
                    }
                    if (user) {
                        console.log('user exists');
                        return done(null, false);
                    } else {
                        var newUser = new User();
                        newUser.local.email    = email;
                        newUser.local.password = newUser.hash(password);
                        newUser.save(err => {
                            if (err) throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));
};