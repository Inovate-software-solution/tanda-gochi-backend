const User = require("../schemas/User");
const Item = require("../schemas/Item");
const Outfit = require("../schemas/Outfit");
const Toy = require("../schemas/Toy");

export const buyItem = async (req, res, next) => {
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

    if (user.Credits < item.Price * req.body.Quantity) {
      res.status(403).json({ error: true, message: "Not enough credit" });
      return;
    }

    // Check if the user has the item in inventory
    const userItem = user.Inventory.find(
      (item) => item.ItemId.toString() === req.body.ItemId
    );
    if (userItem) {
      userItem.Quantity += req.body.Quantity;
    } else {
      user.Inventory.push({
        ItemId: req.body.ItemId,
        Quantity: req.body.Quantity,
      });
    }

    user.Credits -= item.Price * req.body.Quantity;
    user.LastInteraction = Date.now();
    await user.save();

    res
      .status(200)
      .json({ error: false, message: "The item bought successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      message: "Internal server error: " + error.message,
    });
  }
};

export const useItem = async (req, res, next) => {
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

    const userItem = user.Inventory.find(
      (e) => e.ItemId.toString() === req.body.ItemId
    );
    if (!userItem) {
      res.status(403).json({ error: true, message: "User does not have item" });
      return;
    }
    if (userItem.Quantity < 1) {
      res.status(403).json({ error: true, message: "Item out of stock" });
      return;
    }
    userItem.Quantity -= 1;
    user.LastInteraction = Date.now();
    user.markModified("Inventory");
    await user.save();

    res.status(200).json({ error: false, message: "Item used" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      message: "Internal server error: " + error.message,
    });
  }
};

export const buyOutfit = async (req, res, next) => {
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

    if (user.Credits < outfit.Price) {
      res.status(403).json({ error: true, message: "Not enough credit" });
      return;
    }

    // Check if the user has the outfit in inventory
    const userOutfit = user.OutfitsInventory.find(
      (e) => e.OutfitId.toString() === req.body.OutfitId
    );
    if (userOutfit) {
      res.status(403).json({ error: true, message: "Outfit already bought" });
      return;
    }

    user.OutfitsInventory.push({
      OutfitId: req.body.OutfitId,
    });

    user.Credits -= outfit.Price;

    await user.save();

    res.status(200).json({ error: false, message: "The outfit bought" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      message: "Internal server error: " + error.message,
    });
  }
};

export const equipOutfit = async (req, res, next) => {
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
    const selectedOutfit = user.OutfitsInventory.find(
      (e) => e.OutfitId.toString() === req.body.OutfitId
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

    user.OutfitsInventory.forEach((e) => (e.Equipped = false));
    selectedOutfit.Equipped = true;

    user.LastInteraction = Date.now();
    await user.save();

    res.status(200).json({ error: false, message: "The outfit equipped" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      message: "Internal server error: " + error.message,
    });
  }
};

export const buyToy = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.body.UserId });
    if (!user) {
      res.status(404).json({ error: true, message: "User do not exists" });
      return;
    }

    const toy = await Toy.findOne({ _id: req.body.ToyId });

    if (!toy) {
      res.status(404).json({ error: true, message: "Toy do not exists" });
      return;
    }

    if (user.Credits < toy.Price) {
      res.status(403).json({ error: true, message: "Not enough credit" });
      return;
    }

    // Check if the user has the toy in inventory
    const userToy = user.ToysInventory.find(
      (e) => e.ToyId.toString() === req.body.ToyId
    );
    if (userToy) {
      res.status(403).json({ error: true, message: "Toy already bought" });
      return;
    }

    user.ToysInventory.push({
      ToyId: req.body.ToyId,
    });

    user.Credits -= toy.Price;

    await user.save();

    res.status(200).json({ error: false, message: "The toy bought" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      message: "Internal server error: " + error.message,
    });
  }
};
