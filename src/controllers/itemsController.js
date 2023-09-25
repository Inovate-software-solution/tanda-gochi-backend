const Item = require("../schemas/Item");

export const getItems = async (req, res, next) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
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

export const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findOne({ _id: req.params.id });
    if (!outfit) {
      res.status(404).json({ error: true, message: "Outfit do not exists" });
      return;
    }
    res.status(200).json(item);
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

export const uploadItem = async (req, res, next) => {
  try {
    const item = new Item({
      Name: req.body.Name,
      Description: req.body.Description,
      Price: req.body.Price,
      ImageURL: req.file.filename,
    });
    await item.save();
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

export const updateItem = async (req, res, next) => {
  try {
    const item = await Item.findOne({ _id: req.params.id });
    if (!item) {
      res.status(404).json({ error: true, message: "Item do not exists" });
      return;
    }

    item.Name = req.body.Name;
    item.Description = req.body.Description;
    item.Price = req.body.Price;

    if (req.file) {
      item.ImageURL = req.file.filename;
    }
    await item.save();

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

export const deleteItem = async (req, res, next) => {
  try {
    await Item.findOneAndDelete({ _id: req.params.id });
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
