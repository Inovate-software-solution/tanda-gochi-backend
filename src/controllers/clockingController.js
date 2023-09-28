const User = require("../schemas/User");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const Device = require("../schemas/Device");

export const clockIn = async (req, res, next) => {
  // Define time at the start of the function to ensure that the time is as close as possible
  const ClockTime = new Date.now();

  // This rotue will handle the score, credits and badges and should be called on every clocking
  // Check for the valid device
  try {
    const payload = jwt.verify(
      req.body.DeviceToken,
      process.env.JWT_SECRET_DEVICE
    );
    req.body.DeviceId = payload.DeviceId;
  } catch (error) {
    res.status(401).json({ error: true, message: "Invalid DeviceToken" });
    return;
  }

  // Check if the deviceId is registered
  try {
    const device = await Device.findOne({ DeviceId: req.body.DeviceId });
    if (!device) {
      res
        .status(404)
        .json({ error: true, message: "Device is not registered" });
      return;
    }

    req.body.TandaDeviceId = device.TandaDeviceId;
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      message: "Internal server error: " + error.message,
    });
    return;
  }

  // Match the passcode with the user
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

  // Update the user's score, credits and badges
  const user = await User.findOne({ EmployeeId: clockingUser.id });
  if (req.body.GameResult === "win") {
    user.Credits += 100;
  } else {
    user.Credits += 95;
  }

  // The clock in and out will be handle at the end of the controller to ensure that there will be no error that will cause the user to not get clocked in/out
  // Clock the user in/out
  await axios
    .post(
      req.TandaAPI + "/clockins",
      {
        user_id: clockingUser.id,
        device_id: req.body.TandaDeviceId,
        type: req.body.ClockingType,
        time: ClockTime,
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
};
