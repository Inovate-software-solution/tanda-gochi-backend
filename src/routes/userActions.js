const express = require("express");
const router = express.Router();

import authorize from "../middleware/authorize.js";

import * as validator from "../validators/userActionsValidator";
import * as controller from "../controllers/userActionsController";

router.post(
  "/buy/item",
  validator.postBuyItemBodyValidator,
  authorize(["user"]),
  controller.buyItem
);

router.post(
  "/use/item",
  validator.postUseItemBodyValidator,
  authorize(["user"]),
  controller.useItem
);

router.post(
  "/buy/outfit",
  validator.postBuyOutfitBodyValidator,
  authorize(["user"]),
  controller.buyOutfit
);

router.post(
  "/equip/outfit",
  validator.postEquipOutfitBodyValidator,
  authorize(["user"]),
  controller.equipOutfit
);

router.post(
  "/buy/toy",
  validator.postBuyToyBodyValidator,
  authorize(["user"]),
  controller.buyToy
);

module.exports = router;
