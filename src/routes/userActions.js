const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../schemas/User");
const Item = require("../schemas/Item");
const Outfit = require("../schemas/Outfit");

router.post("/buy/item", async function (req, res, next) {
  if (!req.body.UserId || !req.body.ItemId || !req.body.Quantity) {
    res.status(400).json({ error: true, message: "Missing data" });
    return;
  }

  try {
    const item = await Item.findOne({ _id: req.body.ItemId });
    if (!item) {
      res.status(404).json({ error: true, message: "Item do not exists" });
      return;
    }

    const user = await User.findOne({ _id: req.body.UserId });
    if (!user) {
      res.status(404).json({ error: true, message: "User do not exists" });
      return;
    }

    if (user.Credit < item.Price * req.body.Quantity) {
      res.status(403).json({ error: true, message: "Not enough credit" });
      return;
    }

    // Check if the user has the item in inventory
    const userItem = user.Inventory.find(
      (item) => item.ItemId === req.body.ItemId
    );
    if (userItem) {
      userItem.Quantity += req.body.Quantity;
    } else {
      user.Inventory.push({
        ItemId: req.body.ItemId,
        Quantity: req.body.Quantity,
      });
    }

    user.Credit -= item.Price * req.body.Quantity;
    await user.save();

    res
      .status(200)
      .json({ error: false, message: "The item bought successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.post("/use/item", async function (req, res, next) {
  if (!req.body.UserId || !req.body.ItemId) {
    res.status(400).json({ error: true, message: "Invalid request body" });
    return;
  }

  try {
    const user = await User.findOne({ _id: req.body.UserId });
    const item = await Item.findOne({ _id: req.body.ItemId });

    if (!user) {
      res.status(404).json({ error: true, message: "Invalid UserId" });
      return;
    }

    if (!item) {
      res.status(404).json({ error: true, message: "Invalid ItemId" });
      return;
    }

    const userItem = user.Inventory.find((e) => e.ItemId === req.body.ItemId);
    if (!userItem) {
      res.status(403).json({ error: true, message: "User does not have item" });
      return;
    }
    if (userItem.Quantity < 1) {
      res.status(403).json({ error: true, message: "Item out of stock" });
      return;
    }
    userItem.Quantity -= 1;
    await user.save();

    res.status(200).json({ error: false, message: "Item used" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.post("/buy/outfit", async function (req, res, next) {
  if (!req.body.UserId || !req.body.OutfitId) {
    res.status(400).json({ error: true, message: "Missing data" });
    return;
  }

  try {
    const user = await User.findOne({ _id: req.body.UserId });
    if (!user) {
      res.status(404).json({ error: true, message: "User do not exists" });
      return;
    }

    const outfit = await Outfit.findOne({ _id: req.body.OutfitId });

    if (!outfit) {
      res.status(404).json({ error: true, message: "Outfit do not exists" });
      return;
    }

    if (user.Credit < outfit.Price) {
      res.status(403).json({ error: true, message: "Not enough credit" });
      return;
    }

    // Check if the user has the outfit in inventory
    const userOutfit = user.Inventory.findOne({ _id: req.body.OutfitId });
    if (userOutfit) {
      res.status(403).json({ error: true, message: "Outfit already bought" });
      return;
    }

    user.Inventory.push({
      OutfitId: req.body.OutfitId,
    });

    user.Credit -= outfit.Price;

    await user.save();

    res.status(200).json({ error: false, message: "The outfit bought" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.post("/equip/outfit", async function (req, res, next) {
  if (!req.body.UserId || !req.body.OutfitId) {
    res.status(400).json({ error: true, message: "Missing data" });
    return;
  }

  try {
    const user = await User.findOne({ _id: req.body.UserId });
    if (!user) {
      res.status(404).json({ error: true, message: "User do not exists" });
      return;
    }

    const outfit = await Outfit.findOne({ _id: req.body.OutfitId });

    if (!outfit) {
      res.status(404).json({ error: true, message: "Outfit do not exists" });
      return;
    }

    // Check if the user has the outfit in inventory
    const selectedOutfit = user.Inventory.find(
      (e) => e.OutfitId === req.body.OutfitId
    );
    if (!selectedOutfit) {
      res
        .status(403)
        .json({ error: true, message: "User does not own the outfit" });
      return;
    }

    if (selectedOutfit.Equipped) {
      res.status(304).json({ error: true, message: "Outfit already equipped" });
      return;
    }

    user.Inventory.forEach((e) => (e.Equipped = false));
    selectedOutfit.Equipped = true;

    await user.save();

    res.status(200).json({ error: false, message: "The outfit equipped" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

module.exports = router;
