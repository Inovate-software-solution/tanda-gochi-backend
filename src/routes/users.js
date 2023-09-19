import express from "express";

const router = express.Router();

import * as validator from "../validators/userValidator";
import * as controller from "../controllers/usersController";

router.get("/", controller.getUsers);

router.get("/:id", validator.paramsIdValidation, controller.getUserById);

router.post("/login", validator.postLoginBodyValidation, controller.postLogin);

router.post(
  "/checkUser",
  validator.postUserValidation,
  validator.TandaUserValidation,
  controller.postCheckUser
);

router.post(
  "/register",
  validator.postRegisterBodyValidation,
  validator.TandaUserValidation,
  controller.postRegister
);

router.put(
  "/changePassword",
  validator.putRegisterBodyValidation,
  controller.putChangePassword
);

router.delete(
  "/delete/:id",
  validator.paramsIdValidation,
  controller.deleteUserById
);

module.exports = router;
