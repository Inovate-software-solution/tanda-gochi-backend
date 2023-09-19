const express = require("express");
const router = express.Router();

import * as validator from "../validators/userActionsValidator";
import * as controller from "../controllers/userActionsController";

router.post(
  "/buy/item",
  validator.postBuyItemBodyValidator,
  controller.buyItem
);

router.post(
  "/use/item",
  validator.postUseItemBodyValidator,
  controller.useItem
);

router.post(
  "/buy/outfit",
  validator.postBuyOutfitBodyValidator,
  controller.buyOutfit
);

router.post(
  "/equip/outfit",
  validator.postEquipOutfitBodyValidator,
  controller.equipOutfit
);

module.exports = router;
