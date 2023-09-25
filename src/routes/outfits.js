import express from "express";
const router = express.Router();

import authorize from "../middleware/authorize.js";

import * as controller from "../controllers/outfitsController.js";
import * as validator from "../validators/outfitValidator.js";

router.get("/", authorize(["user"]), controller.getOutfits);

router.get(
  "/:id",
  validator.paramsIdValidation,
  authorize(["user"]),
  controller.getOutfitById
);

router.post(
  "/create",
  validator.postMediaTypeValidation,
  validator.postBodyValidation,
  authorize(["user", "admin"]),
  controller.uploadOutfit
);

router.put(
  "/edit/:id",
  validator.paramsIdValidation,
  validator.putMediaTypeValidation,
  validator.putBodyValidation,
  authorize(["user", "admin"]),
  controller.updateOutfit
);

router.delete(
  "/delete/:id",
  validator.paramsIdValidation,
  authorize(["user", "admin"]),
  controller.deleteOutfit
);

module.exports = router;
