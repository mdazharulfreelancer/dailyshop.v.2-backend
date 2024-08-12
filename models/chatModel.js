const mongoose = require('mongoose');

const ChatSchema = mongoose.Schema({
    member : Array,
    date : {
        type : Date,
        default : Date.now()
    },
    update : {
        type : Date,
        default : Date.now()
    },

})

module.exports = mongoose.model('Chat', ChatSchema)