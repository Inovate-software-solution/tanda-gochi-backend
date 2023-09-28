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
  Credits: {
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
      },
      Quantity: {
        type: Number,
        required: true,
        default: 0,
      },
    },
  ],

  ToysInventory: [
    {
      ToyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Toys",
        required: true,
      },
    },
  ],

  OutfitsInventory: [
    {
      OutfitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Outfits",
        required: true,
      },
      Equipped: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
  ],

  LastInteraction: {
    type: Number,
    required: true,
    default: () => Date.now(),
  },
});

module.exports = mongoose.model("User", UserSchema);
