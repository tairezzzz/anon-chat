var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');

module.exports = passport => {
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(err, user)));

    passport.use('local-login', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {
            //process.nextTick(() => {

                User.findOne({'local.email': email}, function(err, user) {
                    console.log(done);
                    if (err) {
                        console.log(err);
                        return done(err);
                    }
                    if (user && !user.validPassword(password)) {
                        console.log('invalidPassword');
                        return done(null, false, {message: 'Wrong password'});
                    }
                    if (!user) {
                        console.log('creating new user');
                        var newUser = new User();
                        newUser.local.email = email;
                        newUser.local.password = newUser.hash(password);
                        newUser.save(err => {
                            if (err) {
                                console.log(err);
                                return done(err);
                            }
                            console.log('new user');
                            return done(null, newUser);
                        });
                    }
                    console.log('user');
                    return done(null, user);
                });
            //});

        }));
};