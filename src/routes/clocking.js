import express from "express";
const router = express.Router();

import authorize from "../middleware/authorize.js";

import * as controller from "../controllers/clockingController";
import * as validator from "../validators/clockingValidator";

router.post(
  "/clockin",
  validator.postClockinRequestValidation,
  controller.clockIn
);

module.exports = router;
