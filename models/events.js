const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventsSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  date: {
      type: Date,
      required: true,
  },
  url:{
      type: String,
      required: true,
  }
});

module.exports = mongoose.model('events' , eventsSchema);