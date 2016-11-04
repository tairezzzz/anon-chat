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
        },
        rooms: Array
    });

userSchema.methods.hash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
};
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};
userSchema.methods.joinRoom = function(room) {
    return this.rooms.push(room.toLowerCase());
};
userSchema.methods.leaveRoom = function(room) {
    let index = this.rooms.indexOf(room);
    return this.rooms.splice(index, 1);
};

module.exports = mongoose.model('User', userSchema);