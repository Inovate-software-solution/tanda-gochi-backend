const Joi = require("joi");
const multer = require("multer");
const mongoose = require("mongoose");

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

export const postBodyValidation = function (req, res, next) {
  const schema = Joi.object({
    Title: Joi.string().required(),
    Description: Joi.string().optional(),
    file: Joi.any().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: true, message: error.message });
    return;
  }
  next();
};

export const putMediaTypeValidation = function (req, res, next) {
  // Check if the request is application/json or multipart/form-data
  // If it is not, return next() as it should be handled by multer instance
  if (req.is("application/json")) {
    return (req, res, next) => next();
  }
  if (req.is("multipart/form-data")) {
    return upload.single("file");
  }
};

export const putBodyValidation = function (req, res, next) {
  const schema = Joi.object({
    Title: Joi.string().required(),
    Description: Joi.string().optional(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: true, message: error.message });
    return;
  }
  next();
};

export const paramsIdValidation = function (req, res, next) {
  const schema = Joi.object({
    id: Joi.string()
      .custom((value, helper) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helper.message("Invalid Id");
        }
        return value;
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
