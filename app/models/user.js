const mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),

    userSchema = mongoose.Schema({
        local: {
            email: String,
            password: String,
        },
        google: {
            id: String,
            token: String,
            email: String,
            name: String
        }
    });

userSchema.methods.hash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
};
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);