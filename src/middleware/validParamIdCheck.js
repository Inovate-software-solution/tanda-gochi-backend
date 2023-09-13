const mongoose = require("mongoose");

const validIdCheck = (req, res, next) => {
  if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ error: true, message: "Missing or Invalid Id" });
    return;
  }
  next();
};

module.exports = validIdCheck;
