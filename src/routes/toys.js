import express from "express";
const router = express.Router();

import authorize from "../middleware/authorize.js";

import * as controller from "../controllers/toysController.js";
import * as validator from "../validators/toysValidator.js";

router.get("/", authorize(["user"]), controller.getToys);

router.get(
  "/:id",
  validator.paramsIdValidation,
  authorize(["user"]),
  controller.getToyById
);

router.post(
  "/upload",
  validator.postMediaTypeValidation,
  validator.postBodyValidation,
  authorize(["user", "admin"]),
  controller.uploadToy
);

router.put(
  "/edit/:id",
  validator.paramsIdValidation,
  validator.putMediaTypeValidation,
  validator.putBodyValidation,
  authorize(["user", "admin"]),
  controller.updateToy
);

router.delete(
  "/delete/:id",
  validator.paramsIdValidation,
  authorize(["user", "admin"]),
  controller.deleteToy
);

module.exports = router;
