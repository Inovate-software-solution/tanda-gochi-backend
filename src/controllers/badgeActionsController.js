const Badge = require("../schemas/Badge");
const User = require("../schemas/User");

export const grantBadge = async function (req, res, next) {
  try {
    // Check if badge exists
    const badge = await Badge.findOne({ _id: req.params.BadgeId });
    if (!badge) {
      res.status(404).json({ error: true, message: "Badge do not exists" });
      return;
    }
    // Check if user exists
    const user = await User.findOne({ _id: req.params.UserId });
    if (!user) {
      res.status(404).json({ error: true, message: "User do not exists" });
      return;
    }

    // Check if user already has the badge
    const hasBadge = user.Badges.find((e) => e.BadgeId === badge._id);
    if (hasBadge) {
      res
        .status(403)
        .json({ error: true, message: "User already has this badge" });
      return;
    }

    // Grant badge to user
    user.Badges.push({ BadgeId: badge._id, DateAwarded: Date.now() });
    await user.save();

    // Send response
    res.status(200).json({ error: false, message: "Success" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      message: "Internal server error: " + error.message,
    });
  }
};

export const revokeBadge = async function (req, res, next) {
  try {
    // Check if badge exists
    const badge = await Badge.findOne({ _id: req.params.BadgeId });
    if (!badge) {
      res.status(404).json({ error: true, message: "Badge do not exists" });
      return;
    }

    // Check if user exists
    const user = await User.findOne({ _id: req.params.UserId });
    if (!user) {
      res.status(404).json({ error: true, message: "User do not exists" });
      return;
    }

    // Check if user has the badge
    const hasBadge = user.Badges.find((e) => e.BadgeId === badge._id);
    if (!hasBadge) {
      res
        .status(403)
        .json({ error: true, message: "User do not have this badge" });
      return;
    }

    // Revoke badge from user
    user.Badges = user.Badges.filter((e) => e.BadgeId !== badge._id);
    await user.save();

    // Send response
    res.status(200).json({ error: false, message: "Success" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      message: "Internal server error: " + error.message,
    });
  }
};
