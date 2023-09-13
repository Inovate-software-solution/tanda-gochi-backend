const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema({
  DeviceId: {
    type: Number,
    required: true,
  },
  DeviceToken: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Devices", DeviceSchema);
