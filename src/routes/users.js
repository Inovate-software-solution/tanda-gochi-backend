import express from "express";

import authorize from "../middleware/authorize.js";

const router = express.Router();

import * as validator from "../validators/userValidator";
import * as controller from "../controllers/usersController";

router.get("/", authorize(["user", "admin"]), controller.getUsers);

router.get(
  "/:id",
  validator.paramsIdValidation,
  authorize(["user", "admin"]),
  controller.getUserById
);

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
  authorize(["user"]),
  controller.putChangePassword
);

router.delete(
  "/delete/:id",
  validator.paramsIdValidation,
  authorize(["user", "admin"]),
  controller.deleteUserById
);

router.get(
  "/current/badges",
  authorize(["user"]),
  controller.getCurrentUserBadges
);

router.get(
  "/:id/badges",
  validator.paramsIdValidation,
  authorize(["user"]),
  controller.getUserBadges
);

router.get(
  "/current/inventory",
  authorize(["user"]),
  controller.getCurrentUserInventory
);

router.get(
  "/:id/inventory",
  validator.paramsIdValidation,
  authorize(["user", "admin"]),
  controller.getUserInventory
);

router.post(
  "/addcredits",
  validator.postAddCreditsValidation,
  authorize(["user", "admin"]),
  controller.postAddCredits
);
module.exports = router;
