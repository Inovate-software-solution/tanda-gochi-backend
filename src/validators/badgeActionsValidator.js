const Joi = require("joi");

export const postGrantBodyValidation = function (req, res, next) {
  const schema = Joi.object({
    UserId: Joi.string().required(),
    BadgeId: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: true, message: error.message });
    return;
  }
  next();
};

export const postRevokeBodyValidation = function (req, res, next) {
  const schema = Joi.object({
    UserId: Joi.string().required(),
    BadgeId: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: true, message: error.message });
    return;
  }
  next();
};
