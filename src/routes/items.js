import express from "express";
const router = express.Router();

import * as validator from "../validators/itemValidator.js";
import * as controller from "../controllers/itemsController.js";

router.get("/", controller.getItems);

router.get("/:id", validator.paramsIdValidation, controller.getItemById);

router.post(
  "/upload",
  validator.postMediaTypeValidation,
  validator.postBodyValidation,
  controller.uploadItem
);

router.put(
  "/update/:id",
  validator.putMediaTypeValidation,
  validator.paramsIdValidation,
  validator.putBodyValidation,
  controller.updateItem
);

router.delete(
  "/delete/:id",
  validator.paramsIdValidation,
  controller.deleteItem
);

module.exports = router;
