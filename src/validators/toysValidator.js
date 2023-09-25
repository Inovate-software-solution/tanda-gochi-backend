const multer = require("multer");
const mongoose = require("mongoose");
const Joi = require("joi");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/toys");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e4);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

export const postMediaTypeValidation = function (req, res, next) {
  // Post only accept multipart/form-data
  if (!req.is("multipart/form-data")) {
    res.status(400).json({ error: true, message: "Invalid media type" });
    return;
  }
  upload.single("file")(req, res, () => {
    console.log(req.file);
    console.log(req.body);
    if (!req.file) {
      res.status(400).json({ error: true, message: "Need to upload a file" });
      return;
    }
    next();
  });
};

export const putMediaTypeValidation = function (req, res, next) {
  // Check if the request is application/json or multipart/form-data
  // If it is not, return next() as it should be handled by multer instance
  if (req.is("application/json")) {
    return next();
  }
  if (req.is("multipart/form-data")) {
    upload.single("file")(req, res, () => {
      if (!req.file) {
        res.status(400).json({ error: true, message: "Need to upload a file" });
        return;
      }
      return next();
    });
  }
};

export const postBodyValidation = function (req, res, next) {
  const schema = Joi.object({
    Name: Joi.string().required(),
    Description: Joi.string().optional(),
    Price: Joi.number().required(),
  }).unknown();
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: true, message: error.message });
    return;
  }
  next();
};

export const putBodyValidation = function (req, res, next) {
  const schema = Joi.object({
    Name: Joi.string().required(),
    Description: Joi.string().optional(),
    Price: Joi.number().required(),
  }).unknown();
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
