import express from "express";
const router = express.Router();
const multer = require("multer");
const Item = require("../schemas/Item.js");

import * as validator from "../validators/itemValidator.js";
import * as controller from "../controllers/itemsController.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/items");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e4);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", controller.getItems);

router.get("/:id", validator.paramsIdValidation, controller.getItemById);

router.post(
  "/upload",
  upload.single("file"),
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
