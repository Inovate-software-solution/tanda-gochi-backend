import axios from "axios";
const User = require("../schemas/User");
const bcrypt = require("bcrypt");

export const postRegisterDevice = async (req, res) => {
  try {
    const user = await User.findOne({ Email: req.body.Email });
    if (!user) {
      res.status(401).json({ error: true, message: "User do not exists" });
      return;
    }

    const match = await bcrypt.compare(req.body.Password, user.Password);
    if (!match) {
      res
        .status(401)
        .json({ error: true, message: "Invalid Username or Password" });
      return;
    }

    const response = await axios
      .get(req.TandaAPI + "/users", {
        headers: { Authorization: "Bearer " + process.env.TANDA_AUTH_TOKEN },
      })
      .then((res) => res.data)
      .catch((error) => {
        console.log(error.response.data.error);
        res.status(error.response.status).json(error.response.data.error);
        return;
      });

    const tanda_user = response.find((e) => e.email === req.body.Email);
    if (!tanda_user.platform_role_ids.includes(967961)) {
      res.status(403).json({ error: true, message: "User is not an admin" });
      return;
    }

    const newDevice = await axios
      .post(
        req.TandaAPI + "/devices",
        { nickname: req.body.DeviceName },
        {
          headers: { Authorization: "Bearer " + process.env.TANDA_AUTH_TOKEN },
        }
      )
      .then((res) => res.data)
      .catch((error) => {
        console.log(error.response.data.error);
        res.status(error.response.status).json(error.response.data.error);
        return;
      });

    const payload = { DeviceId: newDevice.id };

    const DeviceToken = req.jwt.sign(payload, process.env.JWT_SECRET_DEVICE);

    res.status(201).json({ DeviceToken: DeviceToken });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      message: "Internal server error: " + error.message,
    });
  }
};

export const postValidateDevice = async (req, res) => {
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
      .then((res) => res.data)
      .then((res) => console.log(res));

    res.status(200).json({ message: "Valid Device" });
  } catch (error) {
    console.log(error.response.data.error);
    res.status(401).json({ error: true, message: "Invalid Device Token" });
  }
};
