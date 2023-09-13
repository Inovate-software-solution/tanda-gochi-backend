const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  Email: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Score: {
    type: Number,
    required: true,
    default: 0,
  },
  Credit: {
    type: Number,
    required: true,
    default: 0,
  },
  Badges: [
    {
      BadgeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Badges",
        required: true,
        unique: true,
      },
      DateAwarded: {
        type: Date,
        required: true,
      },
    },
  ],

  Inventory: [
    {
      ItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Items",
        required: true,
        unique: true,
      },
      Quantity: {
        type: Number,
        required: true,
        default: 0,
      },
    },
  ],

  OutfitsInventory: [
    {
      OutfitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Outfits",
        required: true,
        unique: true,
      },
      Equipped: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
