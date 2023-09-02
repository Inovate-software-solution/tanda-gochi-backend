const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: false,
    default: "",
  },
  Status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
    required: true,
  },
});

module.exports = mongoose.model("Devices", DeviceSchema);
