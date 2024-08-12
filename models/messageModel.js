const mongoose = require('mongoose')

const MessageSchema = mongoose.Schema({
    chatId : {
        type : String
    },
    senderId : {
        type : String
    },
    text : {
        type : String
    },
    date :{
    type : Date,
    default : Date.now()
    },
    update : {
        type : Date,
        default : Date.now()
    }
})

module.exports = mongoose.model('Message', MessageSchema)