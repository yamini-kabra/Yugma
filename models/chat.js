const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const chatSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    message : {
        type : String,
        required : true
    },
    groupCode : {
        type : String,
        required : true
    },
    // time: moment().format('h:mm a')
})

module.exports = mongoose.model('chat', chatSchema)