const Joi = require("joi");

export const postRegisterDeviceValidator = (req, res, next) => {
  const schema = Joi.object({
    DeviceName: Joi.string().required(),
    Email: Joi.string().required().email(),
    Password: Joi.string().required(),
  }).unknown();
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: true, message: error.message });
    return;
  }
  next();
};
