const Toy = require("../schemas/Toy");

export const getToys = async function (req, res, next) {
  try {
    const toys = await Toy.find();
    res.status(200).json(toys);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      message: "Internal server error: " + error.message,
    });
  }
};

export const getToyById = async function (req, res, next) {
  try {
    const toy = await Toy.findOne({ _id: req.params.id });
    if (!toy) {
      res.status(401).json({ error: true, message: "Toy do not exists" });
      return;
    }
    res.status(200).json(toy);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      message: "Internal server error: " + error.message,
    });
  }
};

export const uploadToy = async function (req, res, next) {
  try {
    const toy = new Toy({
      Name: req.body.Name,
      Description: req.body.Description,
      Price: req.body.Price,
      ImageURL: req.file.filename,
    });
    await toy.save();
    res.status(201).json({ error: false, message: "Success" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      message: "Internal server error: " + error.message,
    });
  }
};

export const updateToy = async function (req, res, next) {
  try {
    const toy = await Toy.findOne({ _id: req.params.id });
    if (!toy) {
      res.status(401).json({ error: true, message: "Toy do not exists" });
      return;
    }
    toy.Name = req.body.Name;
    toy.Description = req.body.Description;
    toy.Price = req.body.Price;

    if (req.file) {
      toy.ImageURL = req.file.filename;
    }

    await toy.save();

    res.status(201).json({ error: false, message: "Success" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      message: "Internal server error: " + error.message,
    });
  }
};

export const deleteToy = async function (req, res, next) {
  try {
    const toy = await Toy.findOneAndDelete({ _id: req.params.id });
    if (!toy) {
      res.status(404).json({ error: true, message: "Toy do not exists" });
      return;
    }
    res.status(200).json({ error: false, message: "Success" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: true,
      message: "Internal server error: " + error.message,
    });
  }
};
