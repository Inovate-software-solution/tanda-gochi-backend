import express from "express";
const router = express.Router();
const User = require("../schemas/User");
const Device = require("../schemas/Device");
const axios = require("axios");

// This rotue will handle the score, credits and badges and should be called on every clocking
// This route will also handle the clocking in and out of the user

/**
 * Request body:
 * {
 *    Passcode: String,
 *    DeviceToken: String,
 *    ClockingType: enum("start", "finish")
 * }
 */
router.post("/", async function (req, res, next) {
  if (!req.body.Passcode) {
    res.status(400).json({ error: true, message: "Missing Passcode" });
    return;
  }

  if (!req.body.DeviceToken) {
    res.status(400).json({ error: true, message: "Missing DeviceId" });
    return;
  }

  if (!req.body.ClockingType) {
    res.status(400).json({ error: true, message: "Missing DeviceId" });
    return;
  }

  if (req.body.ClockingType !== "start" || req.body.ClockingType !== "finish") {
    res.status(400).json({ error: true, message: "Invalid ClockingType" });
    return;
  }

  const tandaUsers = await axios
    .get(req.TandaAPI + "/users", {
      headers: { Authorization: "bearer " + process.env.TANDA_AUTH_TOKEN },
    })
    .then((res) => res.data)
    .catch((error) => {
      console.log(error.response.data);
      res
        .status(error.response.status)
        .json({ error: true, message: error.response.data });
    });

  const clockingUser = tandaUsers.find((e) => e.passcode === req.body.Passcode);

  if (!clockingUser) {
    res.status(404).json({ error: true, message: "Invalid Passcode" });
    return;
  }

  await axios
    .post(
      req.TandaAPI + "/clockins",
      {
        user_id: clockingUser.id,
        device_id: req.DeviceId.parseInt(),
        type: req.body.ClockingType,
        time: new Date.now(),
      },
      {
        headers: { Authorization: "bearer " + process.env.TANDA_AUTH_TOKEN },
      }
    )
    .then((res) => res.data)
    .catch((error) => {
      console.log(error.response.data);
      res
        .status(error.response.status)
        .json({ error: true, message: error.response.data });
    });

  const user = await User.findOne({ EmployeeId: clockingUser.id });
});

module.exports = router;
