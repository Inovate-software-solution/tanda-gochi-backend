const mongoose = require("mongoose");

const OutfitSchema = new mongoose.Schema({
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

module.exports = mongoose.model("Outfit", OutfitSchema);
