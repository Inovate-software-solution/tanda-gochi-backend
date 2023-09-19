import express from "express";
const router = express.Router();
const Device = require("../schemas/Device");
const User = require("../schemas/User");
const checkDevice = require("../middleware/checkDevice");
const axios = require("axios");

// Devices route is based on the Tanda API Devices endpoint.
// Devices required to be on TandaAPI to be valid.
// Register device just turn the deviceId into token and save it to the database.
router.post("/register", async function (req, res, next) {
  if (!req.body.DeviceId) {
    res.status(400).json({ error: true, message: "Missing DeviceId" });
    return;
  }

  if (!req.body.Email || !req.body.Password) {
    res.status(400).json({ error: true, message: "Missing Email or Password" });
    return;
  }

  try {
    const user = await User.findOne({ Email: Email });
    if (!user) {
      res.status(401).json({ error: true, message: "User do not exists" });
      return;
    }

    const match = await bcrypt.compare(Password, user.Password);
    if (!match) {
      res
        .status(401)
        .json({ error: true, message: "Invalid Email or Password" });
      return;
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }

  const TandaDevice = await axios
    .get(req.TandaAPI + "/devices/" + req.body.DeviceId, {
      headers: { Authorization: "bearer " + process.env.TANDA_AUTH_TOKEN },
    })
    .then((res) => res.data)
    .catch((error) => {
      console.log(error.response.data);
      res
        .status(error.response.status)
        .json({ error: true, message: error.response.data });
    });

  if (!TandaDevice) {
    res.status(404).json({ error: true, message: "Device do not exist" });
    return;
  }

  const DeviceToken = req.jwt.sign(
    { DeviceId: TandaDevice.id },
    process.env.JWT_SECRET
  );

  try {
    const device = new Device({
      DeviceId: TandaDevice.id,
      DeviceToken: DeviceToken,
    });

    await device.save();
    res.status(200).json({
      error: false,
      message: "Device registered to the Database",
      token: DeviceToken,
    });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.get("/", async function (req, res, next) {
  try {
    const devices = await Device.find();
    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) {
      res.status(404).json({ error: true, message: "Device not found" });
      return;
    }
    await device.remove();
    res.status(200).json({ error: false, message: "Device deleted" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.post("/checkDevice", checkDevice, async function (req, res, next) {
  res.status(200).json({ error: false, message: "Device is valid" });
});

module.exports = router;
