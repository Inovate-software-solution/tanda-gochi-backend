const Joi = require("joi");

export const postBuyItemBodyValidator = function (req, res, next) {
  const schema = Joi.object({
    UserId: Joi.string().required(),
    ItemId: Joi.string().required(),
    Quantity: Joi.number().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: true, message: error.message });
    return;
  }
  next();
};

export const postUseItemBodyValidator = function (req, res, next) {
  const schema = Joi.object({
    UserId: Joi.string().required(),
    ItemId: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: true, message: error.message });
    return;
  }
  next();
};

export const postBuyOutfitBodyValidator = function (req, res, next) {
  const schema = Joi.object({
    UserId: Joi.string().required(),
    OutfitId: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: true, message: error.message });
    return;
  }
  next();
};

export const postEquipOutfitBodyValidator = function (req, res, next) {
  const schema = Joi.object({
    UserId: Joi.string().required(),
    OutfitId: Joi.string().required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: true, message: error.message });
    return;
  }
  next();
};
