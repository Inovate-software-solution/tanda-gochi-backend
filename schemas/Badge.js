const mongoose = require("mongoose");

const BadgeSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: false,
  },
  ImageURL: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Badge", BadgeSchema);
