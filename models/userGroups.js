const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userGroupsSchema = new Schema({
  code: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

 
module.exports = mongoose.model("userGroups", userGroupsSchema);