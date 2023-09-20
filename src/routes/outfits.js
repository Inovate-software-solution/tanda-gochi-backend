import express from "express";
const router = express.Router();

import * as controller from "../controllers/outfitsController.js";
import * as validator from "../validators/outfitValidator.js";

router.get("/", controller.getOutfits);

router.get("/:id", validator.paramsIdValidation, controller.getOutfitById);

router.post(
  "/create",
  validator.postMediaTypeValidation,
  validator.postBodyValidation,
  controller.uploadOutfit
);

router.put(
  "/edit/:id",
  validator.paramsIdValidation,
  validator.putMediaTypeValidation,
  validator.putBodyValidation,
  controller.updateOutfit
);

router.delete(
  "/delete/:id",
  validator.paramsIdValidation,
  controller.deleteOutfit
);

module.exports = router;
