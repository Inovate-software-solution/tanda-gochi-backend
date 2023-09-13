const mongoose = require("mongoose");
const User = require("./User");

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

BadgeSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await User.updateMany(
      { "Badges.BadgeId": doc._id },
      { $pull: { Badges: { BadgeId: doc._id } } }
    );
  }
});

module.exports = mongoose.model("Badge", BadgeSchema);
