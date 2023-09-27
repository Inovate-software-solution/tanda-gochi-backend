const mongoose = require("mongoose");
const Joi = require("joi");
const axios = require("axios");

export const paramsIdValidation = function (req, res, next) {
  const schema = Joi.object({
    id: Joi.string()
      .custom((value, helper) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helper.message("Invalid Id");
        }
        return true;
      })
      .required(),
  });
  const { error } = schema.validate(req.params);
  if (error) {
    res.status(400).json({ error: true, message: error.message });
    return;
  }
  next();
};

export const postRegisterBodyValidation = function (req, res, next) {
  const schema = Joi.object({
    Email: Joi.string().email().required(),
    Password: Joi.string().min(8).required(),
  }).unknown();
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: true, message: error.message });
    return;
  }
  next();
};

export const putRegisterBodyValidation = function (req, res, next) {
  const schema = Joi.object({
    Email: Joi.string().email().required(),
    OldPassword: Joi.string().min(8).required(),
    NewPassword: Joi.string().min(8).required(),
  }).unknown();
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: true, message: error.message });
    return;
  }
  next();
};

export const postLoginBodyValidation = function (req, res, next) {
  const schema = Joi.object({
    Email: Joi.string().email().required(),
    Password: Joi.string().min(8).required(),
  }).unknown();
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: true, message: error.message });
    return;
  }
  next();
};

export const postUserValidation = function (req, res, next) {
  const schema = Joi.object({
    Email: Joi.string().email().required(),
  }).unknown();

  const { error } = schema.validate(req.body);

  if (error) {
    res.status(400).json({ error: true, message: error.message });
    return;
  }
  next();
};

export const TandaUserValidation = async function (req, res, next) {
  try {
    const employee = await axios
      .get(req.TandaAPI + "/users", {
        headers: {
          Authorization: "bearer " + process.env.TANDA_AUTH_TOKEN,
        },
      })
      .then((res) => res.data);
    const user = employee.find((user) => user.email === req.body.Email);
    if (!user) {
      res.status(404).json({
        error: true,
        message: "User is not valid",
      });
      return;
    }

    next();
  } catch (error) {
    console.log(error.response.status);
    res.status(response.status).json(error.response.data);
    return;
  }
};

export const postAddCreditsValidation = function (req, res, next) {
  const schema = Joi.object({
    Credits: Joi.number().min(0).positive().required(),
    TargetUserId: Joi.string().required(),
  }).unknown();

  const { error } = schema.validate(req.body);

  if (error) {
    res.status(400).json({ error: true, message: error.message });
    return;
  }
  next();
};
