const express = require("express");
const router = express.Router();

import authorize from "../middleware/authorize.js";

import * as controller from "../controllers/badgeActionsController.js";
import * as validator from "../validators/badgeActionsValidator.js";

router.post(
  "/grant",
  validator.postGrantBodyValidation,
  authorize(["user", "admin"]),
  controller.grantBadge
);

router.post(
  "/revoke",
  validator.postRevokeBodyValidation,
  authorize(["user", "admin"]),
  controller.revokeBadge
);

module.exports = router;
