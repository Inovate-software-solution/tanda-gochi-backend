const express = require("express");
const router = express.Router();
const multer = require("multer");

import * as controller from "../controllers/badgesController.js";
import * as validator from "../validators/badgeValidator.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/badges");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e4);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", controller.getAllBadges);

router.get("/:id", validator.paramsIdValidation, controller.getBadgeById);

router.post(
  "/upload",
  validator.postMediaTypeValidation,
  validator.postBodyValidation,
  controller.uploadBadge
);

router.put(
  "/edit/:id",
  validator.putMediaTypeValidation,
  validator.paramsIdValidation,
  validator.putBodyValidation,
  controller.updateBadge
);

router.delete(
  "/delete/:id",
  validator.paramsIdValidation,
  controller.deleteBadge
);

router.get(
  "/user/:id",
  validator.paramsIdValidation,
  controller.getBadgesByUserId
);

module.exports = router;
