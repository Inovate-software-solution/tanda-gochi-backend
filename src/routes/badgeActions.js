const express = require("express");
const router = express.Router();
const controller = require("../controllers/badgeActionsController.js");

import * as validator from "../validators/badgeActionsValidator.js";

router.post("/grant", validator.postGrantBodyValidation, controller.grantBadge);

router.post(
  "/revoke",
  validator.postRevokeBodyValidation,
  controller.revokeBadge
);

module.exports = router;
