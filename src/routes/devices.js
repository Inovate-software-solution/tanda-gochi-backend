import express from "express";
const router = express.Router();
import * as validator from "../validators/devicesValidator";
import * as controller from "../controllers/devicesController";

// Devices route is based on the Tanda API Devices endpoint.
// Devices required to be on TandaAPI to be valid.
// Register device just turn the deviceId into token and save it to the database.
router.post(
  "/register",
  validator.postRegisterDeviceValidator,
  controller.postRegisterDevice
);

module.exports = router;
