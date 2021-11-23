const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todoSchema = new Schema({
    task: {
        type: String,
        required: true,
    },
  email: {
    type: String,
    required: true,
  }, 
  checked: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('todo' , todoSchema);