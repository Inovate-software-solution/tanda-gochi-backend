const User = require("../schemas/User");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const Device = require("../schemas/Device");

export const clockIn = async (req, res, next) => {
  // Define time at the start of the function to ensure that the time is as close as possible
  const ClockTime = Date.now();
  console.log(ClockTime);
  const ISO_Today = new Date().toISOString().split("T")[0];
  // This rotue will handle the score, credits and badges and should be called on every clocking
  // Check for the valid device
  try {
    const payload = req.jwt.verify(
      req.body.DeviceToken,
      process.env.JWT_SECRET_DEVICE
    );
    const DeviceId = payload.DeviceId;
    const TandaDeviceResponse = await axios
      .get(req.TandaAPI + "/devices/" + DeviceId, {
        headers: { Authorization: "Bearer " + process.env.TANDA_AUTH_TOKEN },
      })
      .then((res) => res.data);
  } catch (error) {
    console.log(error.response.data.error);
    res.status(401).json({ error: true, message: "Invalid Device Token" });
    return;
  }
  // // Check if the deviceId is registered
  // try {
  //   const device = await Device.findOne({ DeviceId: req.body.DeviceId });
  //   if (!device) {
  //     res
  //       .status(404)
  //       .json({ error: true, message: "Device is not registered" });
  //     return;
  //   }

  //   req.body.TandaDeviceId = device.TandaDeviceId;
  // } catch (error) {
  //   console.log(error.message);
  //   res.status(500).json({
  //     error: true,
  //     message: "Internal server error: " + error.message,
  //   });
  //   return;
  // }

  // Match the passcode with the user
  const tandaUsers = await axios
    .get(req.TandaAPI + "/users", {
      headers: { Authorization: "bearer " + process.env.TANDA_AUTH_TOKEN },
    })
    .then((res) => res.data)
    .catch((error) => {
      console.log(error.response.data.error);
      res
        .status(error.response.status)
        .json({ error: true, message: error.response.data.error });
      return;
    });

  const clockingUser = tandaUsers.find((e) => e.passcode === req.body.Passcode);

  if (!clockingUser) {
    res.status(404).json({ error: true, message: "Invalid Passcode" });
    return;
  }
  const TodaySchedule = await axios
    .get(
      req.TandaAPI +
        `/schedules?user_ids=${clockingUser.id}&from=${ISO_Today}&to=${ISO_Today}`,
      { headers: { Authorization: "Bearer " + process.env.TANDA_AUTH_TOKEN } }
    )
    .then((res) => res.data[0])
    .catch((error) => {
      console.log(error.response.data.error);
      res
        .status(error.response.status)
        .json({ error: true, message: error.response.data.error });
      return;
    });

  // Update the user's score, credits
  try {
    if (req.body.Type === "start") {
      const user = await User.findOne({ Email: clockingUser.email });
      if (user) {
        if (req.body.GameResult === "win") {
          user.Credits += 100;
        } else {
          user.Credits += 95;
        }

        if (!TodaySchedule) {
        } else {
          if (ClockTime <= TodaySchedule.start) {
            user.Score += 100;
          }
        }
      }
      await user.save();
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Internal server error: " + error.message,
    });
  }

  const activeShifts = await axios
    .get(req.TandaAPI + "/shifts/active", {
      headers: { Authorization: "Bearer " + process.env.TANDA_AUTH_TOKEN },
    })
    .then((res) => res.data)
    .catch((error) => {
      console.log(error.response.data.error);
      res
        .status(error.response.status)
        .json({ error: true, message: error.response.data.error });
    });

  const activeShift = activeShifts.find((e) => e.user_id === clockingUser.id);

  if (!activeShift) {
    req.body.Type = "start";
  } else {
    req.body.Type = "finish";
  }

  // The clock in and out will be handle at the end of the controller to ensure that there will be no error that will cause the user to not get clocked in/out
  // Clock the user in/out
  try {
    await axios
      .post(
        req.TandaAPI + "/clockins",
        {
          user_id: clockingUser.id,
          device_id: req.body.TandaDeviceId,
          type: req.body.Type,
          time: ClockTime,
        },
        {
          headers: { Authorization: "bearer " + process.env.TANDA_AUTH_TOKEN },
        }
      )
      .then((res) => res.data);

    res.status(200).json({ error: false, message: "Success" });
  } catch (error) {
    console.log(error.response.data.error);
    res
      .status(error.response.status)
      .json({ error: true, message: error.response.data.error });
    return;
  }
};
