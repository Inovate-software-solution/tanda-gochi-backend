const express = require("express");
const router = express.Router();
const multer = require("multer");
const Item = require("../schemas/Item");
const validIdCheck = require("../middleware/validParamIdCheck");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/items");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e4);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", async function (req, res, next) {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.post("/upload", upload.single("file"), async function (req, res, next) {
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
    const item = new Item({
      Name: Name,
      Description: Description,
      Price: Price,
      ImageURL: req.file.filename,
    });
    await item.save();
    res.status(201).json({ error: false, message: "Success" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.get("/:id", validIdCheck, async function (req, res, next) {
  if (!req.params.id) {
    res.status(400).json({ error: true, message: "Missing outfit id" });
    return;
  }
  try {
    const item = await Item.findOne({ _id: req.params.id });
    if (!outfit) {
      res.status(404).json({ error: true, message: "Outfit do not exists" });
      return;
    }
    res.status(200).json(item);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.put("/update/:id", validIdCheck, async function (req, res, next) {
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
      const item = await Item.findOne({ _id: req.params.id });
      if (!item) {
        res.status(401).json({ error: true, message: "Item do not exists" });
        return;
      }
      item.Name = Name;
      item.Description = Description;
      item.Price = Price;
      await item.save();

      res.status(200).json({ error: false, message: "Success" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  } else {
    try {
      const item = await Item.findOne({ _id: req.params.id });
      if (!item) {
        res.status(401).json({ error: true, message: "Item do not exists" });
        return;
      }
      item.Name = Name;
      item.Description = Description;
      item.Price = Price;
      item.ImageURL = req.file.filename;
      await item.save();

      res.status(200).json({ error: false, message: "Success" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  }
});

router.delete("/delete/:id", validIdCheck, async function (req, res, next) {
  if (!req.params.id) {
    res.status(400).json({ error: true, message: "Missing item id" });
    return;
  }
  try {
    await Item.findOneAndDelete({ _id: req.params.id });
    res.status(200).json({ error: false, message: "Success" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

module.exports = router;
