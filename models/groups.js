const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupsSchema = new Schema({
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('groups' , groupsSchema);