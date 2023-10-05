const Joi = require("joi");

export const postClockinRequestValidation = function (req, res, next) {
  const schema = Joi.object({
    Passcode: Joi.string().required().length(4),
    DeviceToken: Joi.string().required(),
    GameResult: Joi.string().required().valid("win", "lose", "draw"),
  }).unknown();
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: true, message: error.message });
    return;
  }
  next();
};
