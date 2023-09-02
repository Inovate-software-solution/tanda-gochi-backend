const express = require("express");
const router = express.Router();
const Badge = require("../schemas/Badge");
const User = require("../schemas/User");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/badges");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e4);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", async function (req, res, next) {
  try {
    const badges = await Badge.find();
    res.status(200).json({ error: false, message: badges });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.get("/:id", async function (req, res, next) {
  if (!req.params.id) {
    res.status(401).json({ error: true, message: "Missing badge id" });
    return;
  }
  try {
    const badge = await Badge.findOne({ _id: req.params.id });
    if (!badge) {
      res.status(401).json({ error: true, message: "Badge do not exists" });
      return;
    }
    res.status(200).json(badge);
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.post("/upload", upload.single("file"), async function (req, res, next) {
  if (!req.file) {
    res.status(401).json({ error: true, message: "Missing file" });
    return;
  }

  if (!req.body.Title) {
    res
      .status(401)
      .json({ error: true, message: "Missing Title or Description" });
    return;
  }

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
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.put("/edit/:id", upload.single("file"), async function (req, res, next) {
  if (!req.params.id) {
    res.status(401).json({ error: true, message: "Missing badge id" });
    return;
  }

  if (!req.body.Title) {
    res
      .status(401)
      .json({ error: true, message: "Missing Title or Description" });
    return;
  }

  try {
    const badge = await Badge.findOne({ _id: req.params.id });
    if (!badge) {
      res.status(401).json({ error: true, message: "Badge do not exists" });
      return;
    }

    badge.Title = req.body.Title;
    badge.Description = req.body.Description;
    if (req.file) {
      badge.ImageURL = req.file.filename;
    }
    await badge.save();

    res.status(201).json({ error: false, message: "Success" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.get("/list/user/:id", async function (req, res, next) {
  if (!req.params.id) {
    res.status(401).json({ error: true, message: "Missing user id" });
    return;
  }
  try {
    const badges = await User.findOne({ _id: req.params.id });
    if (!badges) {
      res.status(401).json({ error: true, message: "User do not exists" });
      return;
    }
    res.status(200).json(badges.Badges);
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.post("/user/:id/grant/:badgeId", async function (req, res, next) {
  if (!req.params.id) {
    res.status(401).json({ error: true, message: "Missing user id" });
    return;
  }
  if (!req.params.badgeId) {
    res.status(401).json({ error: true, message: "Missing badge id" });
    return;
  }

  try {
    const badge = await Badge.findOne({ _id: req.params.badgeId });
    if (!badge) {
      res.status(401).json({ error: true, message: "Badge do not exists" });
      return;
    }

    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      res.status(401).json({ error: true, message: "User do not exists" });
      return;
    }

    const badgeExists = user.Badges.find((b) => b.badgeId === badge._id);
    if (badgeExists) {
      res
        .status(401)
        .json({ error: true, message: "User already has this badge" });
      return;
    }

    user.Badges.push({ badgeId: badge._id, dateAwarded: new Date() });
    await user.save();

    res.status(201).json({ error: false, message: "Success" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.post("/user/:id/revoke/:badgeId", async function (req, res, next) {
  if (!req.params.id) {
    res.status(401).json({ error: true, message: "Missing user id" });
    return;
  }
  if (!req.params.badgeId) {
    res.status(401).json({ error: true, message: "Missing badge id" });
    return;
  }

  try {
    const badge = await Badge.findOne({ _id: req.params.badgeId });
    if (!badge) {
      res.status(401).json({ error: true, message: "Badge do not exists" });
      return;
    }

    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      res.status(401).json({ error: true, message: "User do not exists" });
      return;
    }

    const badgeExists = user.Badges.find((b) => b.badgeId === badge._id);
    if (!badgeExists) {
      res
        .status(401)
        .json({ error: true, message: "User doesn't have this badge" });
      return;
    }

    user.Badges = user.Badges.filter((b) => b.badgeId !== badge._id);
    await user.save();

    res.status(201).json({ error: false, message: "Success" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

module.exports = router;
