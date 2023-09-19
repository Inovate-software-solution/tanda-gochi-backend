import express from "express";
const router = express.Router();
const multer = require("multer");

import * as controller from "../controllers/outfitsController.js";
import * as validator from "../validators/outfitValidator.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/outfits");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e4);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", controller.getOutfits);

router.post("/create", validator.postBodyValidation, controller.uploadOutfit);

router.get("/:id", validator.paramsIdValidation, controller.getOutfitById);

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
