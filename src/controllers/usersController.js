const axios = require("axios");
const bcrypt = require("bcrypt");
const User = require("../schemas/User");

export const getUsers = async function (req, res, next) {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

export const getUserById = async function (req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ error: true, message: "User do not exists" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

export const postLogin = async function (req, res, next) {
  try {
    const user = await User.findOne({ Email: req.body.Email });
    if (!user) {
      res.status(401).json({ error: true, message: "User do not exists" });
      return;
    }

    const match = await bcrypt.compare(req.body.Password, user.Password);
    if (!match) {
      res.status(401).json({ error: true, message: "Wrong password" });
      return;
    }

    const token = req.jwt.sign(
      { Email: req.body.Email },
      process.env.JWT_SECRET,
      {
        expiresIn: 86400,
      }
    );

    res.status(200).json({ error: false, token: token });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

export const postRegister = async function (req, res, next) {
  try {
    const encryptedPassword = await bcrypt.hash(req.body.Password, 10);
    const NewUser = new User({
      Email: req.body.Email,
      Password: encryptedPassword,
    });
    const user = await User.findOne({ Email: req.body.Email });

    if (user) {
      res.status(403).json({ error: true, message: "User already exists!" });
      return;
    }

    await NewUser.save();
    res.status(200).json({ error: false, message: "Success" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

export const postCheckUser = async function (req, res, next) {
  try {
    const user = await User.findOne({ Email: req.body.Email });
    if (!user) {
      res.status(404).json({
        error: true,
        message: "User is valid and exist in Tanda DB but not registered",
      });
      return;
    }
    res
      .status(200)
      .json({ error: false, message: "User exists and registered" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

export const putChangePassword = async function (req, res, next) {
  const encryptedPassword = bcrypt.hashSync(NewPassword, 10);

  try {
    const user = await User.findOne({ Email: req.body.Email });
    if (!user) {
      res.status(404).json({ error: true, message: "User do not exists" });
      return;
    }

    const match = bcrypt.compareSync(OldPassword, user.Password);
    if (!match) {
      res
        .status(401)
        .json({ error: true, message: "Invalid Email or Password" });
      return;
    }

    await user.updateOne({ Password: encryptedPassword });

    res.status(200).json({ error: false, message: "Success" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

export const deleteUserById = async function (req, res, next) {
  try {
    await User.findOneAndDelete({ _id: id });
    res.status(201).json({ error: false, message: "Success" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};
