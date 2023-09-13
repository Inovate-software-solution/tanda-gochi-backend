const axios = require("axios");

/**
 * Middleware to check if the device is valid
 *
 * @param {Request} req: Express Request
 * @param {Response} res: Express Response
 * @param {import("express").NextFunction} next: Express NextFunction
 * @returns
 * Passes the DeviceId to the next middleware
 */
const checkDevice = async (req, res, next) => {
  const jwt = req.jwt;
  if (!req.body.DeviceToken) {
    res.status(400).json({ error: true, message: "Missing DeviceToken" });
  }

  const DeviceToken = req.body.DeviceToken;
  const payload = jwt.verify(DeviceToken, process.env.JWT_SECRET);

  const device = await axios
    .get(req.TandaAPI + "/devices/" + payload.DeviceId, {
      headers: { Authorization: "bearer " + process.env.TANDA_AUTH_TOKEN },
    })
    .then((res) => res.data);

  if (!device) {
    res.status(404).json({ error: true, message: "Unauthorized device" });
    return;
  }

  req.DeviceId = payload.DeviceId;

  next();
};

module.exports = checkDevice;
