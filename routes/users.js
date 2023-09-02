const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const axios = require("axios");
const mongoose = require("mongoose");
const User = require("../schemas/User");

router.get("/", async function (req, res, next) {
  try {
    const users = await User.find();
    res.status(200).json({ error: false, message: users });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.get("/:id", async function (req, res, next) {
  const id = req.params.id;
  if (!id) {
    res.status(401).json({ error: true, message: "Missing user id" });
    return;
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(401).json({ error: true, message: "User do not exists" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.post("/login", async function (req, res, next) {
  const jwt = req.jwt;
  const EmployeeId = req.body.EmployeeId;
  const Password = req.body.Password;

  if (!EmployeeId || !Password) {
    res
      .status(401)
      .json({ error: true, message: "Missing EmployeeId or Password" });
    return;
  }

  try {
    const user = await User.findOne({ EmployeeId: EmployeeId });
    if (!user) {
      res.status(401).json({ error: true, message: "User do not exists" });
      return;
    }

    const match = bcrypt.compareSync(Password, user.Password);
    if (!match) {
      res.status(401).json({ error: true, message: "Wrong password" });
      return;
    }

    const token = jwt.sign({ EmployeeId: EmployeeId }, process.env.JWT_SECRET, {
      expiresIn: 86400,
    });

    res.status(200).json({ error: false, token: token });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.post("/checkUser", async function (req, res, next) {
  const EmployeeId = req.body.EmployeeId;

  const employee = await axios.get("https://my.tanda.co/api/v2/users").data;

  if (!employee) {
    res.status(401).json({ error: true, message: "User do not exists" });
    return;
  }

  const user = await User.findOne({ EmployeeId: EmployeeId });
  if (!user) {
    res
      .status(403)
      .json({ error: false, message: "User exists but not registered" });
    return;
  }

  res.status(200).json({ error: false, message: "User exists and registered" });
});

router.post("/register", async function (req, res, next) {
  const EmployeeId = req.body.EmployeeId;
  const Password = req.body.Password;

  if (!EmployeeId || !Password) {
    res
      .status(401)
      .json({ error: true, message: "Missing EmployeeId or Password" });
    return;
  }

  const encryptedPassword = bcrypt.hashSync(Password, 10);
  const NewUser = new User({
    EmployeeId: EmployeeId,
    Password: encryptedPassword,
  });

  try {
    await NewUser.save();
    res.status(200).json({ error: false, message: "Success" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.put("/changePassword", async function (req, res, next) {
  const EmployeeId = req.body.EmployeeId;
  const OldPassword = req.body.OldPassword;
  const NewPassword = req.body.NewPassword;

  if (!EmployeeId || !OldPassword || !NewPassword) {
    res
      .status(401)
      .json({ error: true, message: "Missing EmployeeId or Password" });
    return;
  }

  const encryptedPassword = bcrypt.hashSync(NewPassword, 10);

  try {
    const user = await User.findOne({ EmployeeId: EmployeeId });
    if (!user) {
      res.status(404).json({ error: true, message: "User do not exists" });
      return;
    }

    const match = bcrypt.compareSync(OldPassword, user.Password);
    if (!match) {
      res.status(401).json({ error: true, message: "Wrong password" });
      return;
    }

    await user.updateOne({ Password: encryptedPassword });

    res.status(200).json({ error: false, message: "Success" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.delete("/delete/:id", async function (req, res, next) {
  const id = req.params.id;

  if (!id) {
    res.status(401).json({ error: true, message: "Missing user id" });
    return;
  }

  try {
    await User.findOneAndDelete({ _id: id });
    res.status(200).json({ error: false, message: "Success" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

module.exports = router;
