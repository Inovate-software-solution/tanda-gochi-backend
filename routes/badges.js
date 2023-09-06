const express = require("express");
const router = express.Router();
const Badge = require("../schemas/Badge");
const User = require("../schemas/User");
const validIdCheck = require("../middleware/validParamIdCheck");
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

router.get("/:id", validIdCheck, async function (req, res, next) {
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
    res.status(400).json({ error: true, message: "Missing file" });
    return;
  }

  if (!req.body.Title) {
    res
      .status(400)
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

router.put(
  "/edit/:id",
  validIdCheck,
  upload.single("file"),
  async function (req, res, next) {
    if (!req.body.Title) {
      res
        .status(400)
        .json({ error: true, message: "Missing Title or Description" });
      return;
    }

    try {
      const badge = await Badge.findOne({ _id: req.params.id });
      if (!badge) {
        res.status(404).json({ error: true, message: "Badge do not exists" });
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
  }
);

router.delete("/delete/:id", validIdCheck, async function (req, res, next) {
  try {
    const badge = await Badge.findOne({ _id: req.params.id });
    if (!badge) {
      res.status(404).json({ error: true, message: "Badge do not exists" });
      return;
    }
    await badge.delete();
    res.status(200).json({ error: false, message: "Success" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.get("/user/:id", validIdCheck, async function (req, res, next) {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      res.status(404).json({ error: true, message: "User do not exists" });
      return;
    }
    res.status(200).json(user.Badges);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

module.exports = router;
