import express from "express";
const router = express.Router();

import authorize from "../middleware/authorize.js";

import * as validator from "../validators/itemValidator.js";
import * as controller from "../controllers/itemsController.js";

router.get("/", authorize(["user"]), controller.getItems);

router.get(
  "/:id",
  validator.paramsIdValidation,
  authorize(["user"]),
  controller.getItemById
);

router.post(
  "/upload",
  validator.postMediaTypeValidation,
  validator.postBodyValidation,
  authorize(["user", "admin"]),
  controller.uploadItem
);

router.put(
  "/update/:id",
  validator.putMediaTypeValidation,
  validator.paramsIdValidation,
  validator.putBodyValidation,
  authorize(["user", "admin"]),
  controller.updateItem
);

router.delete(
  "/delete/:id",
  validator.paramsIdValidation,
  authorize(["user", "admin"]),
  controller.deleteItem
);

module.exports = router;
