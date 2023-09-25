const Badge = require("../schemas/Badge");
const User = require("../schemas/User");

export const getAllBadges = async function (req, res, next) {
  try {
    const badges = await Badge.find();
    res.status(200).json(badges);
  } catch (error) {
    res
      .status(500)
      .json({
        error: true,
        message: "Internal server error: " + error.message,
      });
  }
};

export const getBadgeById = async function (req, res, next) {
  try {
    const badge = await Badge.findOne({ _id: req.params.id });
    if (!badge) {
      res.status(404).json({ error: true, message: "Badge do not exists" });
      return;
    }
    res.status(200).json(badge);
  } catch (error) {
    res
      .status(500)
      .json({
        error: true,
        message: "Internal server error: " + error.message,
      });
  }
};

export const uploadBadge = async function (req, res, next) {
  try {
    const badge = new Badge({
      Title: req.body.Title,
      Description: req.body.Description,
      ImageURL: req.file.filename,
    });
    await badge.save();
    res.status(201).json({ error: false, message: "Success" });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({
        error: true,
        message: "Internal server error: " + error.message,
      });
  }
};

export const updateBadge = async function (req, res, next) {
  try {
    const badge = await Badge.findOne({ _id: req.params.id });
    if (!badge) {
      res.status(404).json({ error: true, message: "Badge do not exists" });
      return;
    }

    badge.Title = req.body.Title;
    badge.Description = req.body.Description;

    // If there is a new image, update it
    if (req.file) {
      badge.ImageURL = req.file.filename;
    }
    await badge.save();

    res.status(201).json({ error: false, message: "Success" });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({
        error: true,
        message: "Internal server error: " + error.message,
      });
  }
};

export const deleteBadge = async function (req, res, next) {
  try {
    await Badge.findOneAndDelete({ _id: req.params.id });
    res.status(200).json({ error: false, message: "Success" });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({
        error: true,
        message: "Internal server error: " + error.message,
      });
  }
};

export const getBadgesByUserId = async function (req, res, next) {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      res.status(404).json({ error: true, message: "User do not exists" });
      return;
    }
    res.status(200).json(user.Badges);
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({
        error: true,
        message: "Internal server error: " + error.message,
      });
  }
};
