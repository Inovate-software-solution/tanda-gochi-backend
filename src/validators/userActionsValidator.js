const Joi = require("joi");

export const postBuyItemBodyValidator = function (req, res, next) {
  const schema = Joi.object({
    ItemId: Joi.string().required(),
    Quantity: Joi.number().required(),
  }).unknown();
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: true, message: error.message });
    return;
  }
  next();
};

export const postUseItemBodyValidator = function (req, res, next) {
  const schema = Joi.object({
    ItemId: Joi.string().required(),
  }).unknown();
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: true, message: error.message });
    return;
  }
  next();
};

export const postBuyOutfitBodyValidator = function (req, res, next) {
  const schema = Joi.object({
    OutfitId: Joi.string().required(),
  }).unknown();
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: true, message: error.message });
    return;
  }
  next();
};

export const postEquipOutfitBodyValidator = function (req, res, next) {
  const schema = Joi.object({
    OutfitId: Joi.string().required(),
  }).unknown();
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: true, message: error.message });
    return;
  }
  next();
};

export const postBuyToyBodyValidator = function (req, res, next) {
  const schema = Joi.object({
    ToyId: Joi.string().required(),
  }).unknown();
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: true, message: error.message });
    return;
  }
  next();
};
