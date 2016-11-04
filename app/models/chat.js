const mongoose = require('mongoose'),
    chatSchema = mongoose.Schema({
        created: Date,
        content: String,
        room: String
    });

module.exports = mongoose.model('chat', chatSchema);