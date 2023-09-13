const express = require("express");
const router = express.Router();
const multer = require("multer");
const Outfit = require("../schemas/Outfit");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/outfits");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e4);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", async function (req, res, next) {
  try {
    const outfits = await Outfit.find();
    res.status(200).json(outfits);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.post("/create", upload.single("file"), async function (req, res, next) {
  const Name = req.body.Name;
  const Description = req.body.Description;
  const Price = req.body.Price;

  if (!Name || !Price) {
    res.status(401).json({
      error: true,
      message: "Missing Name, Price",
    });
    return;
  }

  if (!req.file) {
    res.status(401).json({ error: true, message: "Missing file" });
    return;
  }

  try {
    const outfit = new Outfit({
      Name: Name,
      Description: Description,
      Price: Price,
      ImageURL: req.file.filename,
    });
    await outfit.save();
    res.status(201).json({ error: false, message: "Success" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.get("/:id", async function (req, res, next) {
  if (!req.params.id) {
    res.status(401).json({ error: true, message: "Missing outfit id" });
    return;
  }
  try {
    const outfit = await Outfit.findOne({ _id: req.params.id });
    if (!outfit) {
      res.status(401).json({ error: true, message: "Outfit do not exists" });
      return;
    }
    res.status(200).json(outfit);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.put("/edit/:id", async function (req, res, next) {
  const Name = req.body.Name;
  const Description = req.body.Description;
  const Price = req.body.Price;

  if (!Name || !Price) {
    res.status(401).json({
      error: true,
      message: "Missing Name, Price",
    });
    return;
  }

  if (!req.params.id) {
    res.status(401).json({ error: true, message: "Missing outfit id" });
    return;
  }

  if (!req.file) {
    try {
      const outfit = await Outfit.findOne({ _id: req.params.id });
      if (!outfit) {
        res.status(401).json({ error: true, message: "Outfit do not exists" });
        return;
      }
      outfit.Name = Name;
      outfit.Description = Description;
      outfit.Price = Price;
      await outfit.save();

      res.status(201).json({ error: false, message: "Success" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  } else {
    try {
      const outfit = await Outfit.findOne({ _id: req.params.id });
      if (!outfit) {
        res.status(401).json({ error: true, message: "Outfit do not exists" });
        return;
      }
      outfit.Name = Name;
      outfit.Description = Description;
      outfit.Price = Price;
      outfit.ImageURL = req.file.filename;
      await outfit.save();

      res.status(201).json({ error: false, message: "Success" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  }
});

router.delete("/delete/:id", async function (req, res, next) {
  if (!req.params.id) {
    res.status(401).json({ error: true, message: "Missing outfit id" });
    return;
  }
  try {
    await Outfit.deleteOne({ _id: req.params.id });
    res.status(200).json({ error: false, message: "Success" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

module.exports = router;
