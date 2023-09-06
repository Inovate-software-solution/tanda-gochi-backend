const express = require("express");
const router = express.Router();
const User = require("../schemas/User");
const Device = require("../schemas/Device");

// This rotue will handle the score, credits and badges and should be called on every clocking
router.post("/", async function (req, res, next) {
  if (!req.body.EmployeeId) {
    res.status(401).json({ error: true, message: "Missing EmployeeId" });
    return;
  }
  if (!req.body.DeviceId) {
    res.status(401).json({ error: true, message: "Missing DeviceToken" });
    return;
  }
  if (!req.body.ClockingType) {
    res.status(401).json({ error: true, message: "Missing ClockingType" });
    return;
  }

  try {
    const device = await Device.findOne({ _id: req.body.DeviceId });
    if (!device) {
      res.status(401).json({ error: true, message: "Device do not exists" });
      return;
    }
    if (device.Status !== "Active") {
      res.status(401).json({ error: true, message: "Device is not active" });
      return;
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }

  try {
    const user = await User.findOne({ EmployeeId: req.body.EmployeeId });
    if (!user) {
      res.status(401).json({ error: true, message: "User do not exists" });
      return;
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});
