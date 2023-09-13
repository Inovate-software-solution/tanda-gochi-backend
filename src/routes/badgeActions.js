const express = require("express");
const router = express.Router();
const Badge = require("../schemas/Badge");
const User = require("../schemas/User");

router.post("/grant", async function (req, res, next) {
  if (!req.params.UserId) {
    res.status(400).json({ error: true, message: "Missing user id" });
    return;
  }
  if (!req.params.BadgeId) {
    res.status(400).json({ error: true, message: "Missing badge id" });
    return;
  }

  try {
    const badge = await Badge.findOne({ _id: req.params.BadgeId });
    if (!badge) {
      res.status(404).json({ error: true, message: "Badge do not exists" });
      return;
    }

    const user = await User.findOne({ _id: req.params.UserId });
    if (!user) {
      res.status(404).json({ error: true, message: "User do not exists" });
      return;
    }

    user.Badges.push({ BadgeId: badge._id, DateAwarded: Date.now() });
    await user.save();

    res.status(200).json({ error: false, message: "Success" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.post("/revoke", async function (req, res, next) {
  if (!req.params.UserId) {
    res.status(400).json({ error: true, message: "Missing user id" });
    return;
  }
  if (!req.params.BadgeId) {
    res.status(400).json({ error: true, message: "Missing badge id" });
    return;
  }

  try {
    const badge = await Badge.findOne({ _id: req.params.BadgeId });
    if (!badge) {
      res.status(404).json({ error: true, message: "Badge do not exists" });
      return;
    }

    const user = await User.findOne({ _id: req.params.UserId });
    if (!user) {
      res.status(404).json({ error: true, message: "User do not exists" });
      return;
    }

    user.Badges = user.Badges.filter((e) => e.BadgeId !== badge._id);

    await user.save();

    res.status(200).json({ error: false, message: "Success" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

module.exports = router;
