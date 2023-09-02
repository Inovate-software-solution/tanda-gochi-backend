const express = require("express");
const router = express.Router();
const Device = require("../schemas/Device");

/* GET users listing. */
router.post("/register", async function (req, res, next) {
  try {
    const device = new Device({
      Name: req.body.Name,
      Description: req.body.Description,
    });
    await device.save();
    res.status(201).json({ error: false, deviceToken: device._id });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.get("/", async function (req, res, next) {
  try {
    const devices = await Device.find();
    res.status(200).json({ error: false, message: devices });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.post("/checkDevice", async function (req, res, next) {
  const DeviceToken = req.body.DeviceToken;
  if (!DeviceToken) {
    res.status(401).json({ error: true, message: "Missing Device Token" });
    return;
  }
  try {
    const device = await Device.findOne({ _id: DeviceToken });
    if (!device) {
      res.status(401).json({ error: true, message: "Device do not exists" });
      return;
    }

    if (device.Status !== "Active") {
      res.status(401).json({ error: true, message: "Device is not active" });
      return;
    }

    res.status(200).json({ error: false, message: "Device exists" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

module.exports = router;
