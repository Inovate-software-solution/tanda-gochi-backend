const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: false,
  },
  Price: {
    type: Number,
    required: true,
  },
  ImageURL: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Item", ItemSchema);
