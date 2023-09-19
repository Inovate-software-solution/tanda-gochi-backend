const Outfit = require("../schemas/Outfit");

export const getOutfits = async function (req, res, next) {
  try {
    const outfits = await Outfit.find();
    res.status(200).json(outfits);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

export const getOutfitById = async function (req, res, next) {
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
};

export const uploadOutfit = async function (req, res, next) {
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
};

export const updateOutfit = async function (req, res, next) {
  try {
    const outfit = await Outfit.findOne({ _id: req.params.id });
    if (!outfit) {
      res.status(401).json({ error: true, message: "Outfit do not exists" });
      return;
    }
    outfit.Name = Name;
    outfit.Description = Description;
    outfit.Price = Price;

    if (req.file) {
      outfit.ImageURL = req.file.filename;
    }

    await outfit.save();

    res.status(201).json({ error: false, message: "Success" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

export const deleteOutfit = async function (req, res, next) {};
