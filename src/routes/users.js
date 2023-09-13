const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const axios = require("axios");
const mongoose = require("mongoose");
const User = require("../schemas/User");
const validIdCheck = require("../middleware/validParamIdCheck");

router.get("/", async function (req, res, next) {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.get("/:id", validIdCheck, async function (req, res, next) {
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
});

router.post("/login", async function (req, res, next) {
  const jwt = req.jwt;
  const Email = req.body.Email;
  const Password = req.body.Password;

  if (!Email || !Password) {
    res.status(401).json({ error: true, message: "Missing Email or Password" });
    return;
  }

  try {
    const user = await User.findOne({ Email: Email });
    if (!user) {
      res.status(401).json({ error: true, message: "User do not exists" });
      return;
    }

    const match = await bcrypt.compare(Password, user.Password);
    if (!match) {
      res.status(401).json({ error: true, message: "Wrong password" });
      return;
    }

    const token = jwt.sign({ Email: Email }, process.env.JWT_SECRET, {
      expiresIn: 86400,
    });

    res.status(200).json({ error: false, token: token });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

router.post("/checkUser", async function (req, res, next) {
  if (!req.body.Email) {
    res.status(400).json({ error: true, message: "Missing Email" });
    return;
  }

  try {
    const employee = await axios
      .get(req.TandaAPI + "/users", {
        headers: {
          Authorization: "bearer " + process.env.TANDA_AUTH_TOKEN,
        },
      })
      .then((res) => res.data);

    const user = employee.find((user) => user.email === req.body.Email);
    if (!user) {
      res.status(404).json({
        error: true,
        message: "User is not valid",
      });
      return;
    }
  } catch (error) {
    console.log(error.response.status);
    res.status(response.status).json(error.response.data);
    return;
  }

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
});

router.post("/register", async function (req, res, next) {
  const Email = req.body.Email;
  const Password = req.body.Password;
  if (!Email || !Password) {
    res.status(400).json({ error: true, message: "Missing Email or Password" });
    return;
  }

  if (!req.body.Email) {
    res.status(400).json({ error: true, message: "Missing Email" });
    return;
  }

  try {
    const employee = await axios
      .get(req.TandaAPI + "/users", {
        headers: {
          Authorization: "bearer " + process.env.TANDA_AUTH_TOKEN,
        },
      })
      .then((res) => res.data);

    const user = employee.find((user) => user.email === req.body.Email);
    if (!user) {
      res.status(404).json({
        error: true,
        message: "User is not valid",
      });
      return;
    }
  } catch (error) {
    console.log(error.response.status);
    res.status(response.status).json(error.response.data);
    return;
  }

  try {
    const encryptedPassword = await bcrypt.hash(Password, 10);
    const NewUser = new User({
      Email: Email,
      Password: encryptedPassword,
    });
    const user = await User.findOne({ Email: Email });

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
});

router.put("/changePassword", async function (req, res, next) {
  const Email = req.body.Email;
  const OldPassword = req.body.OldPassword;
  const NewPassword = req.body.NewPassword;

  if (!Email || !OldPassword || !NewPassword) {
    res.status(401).json({ error: true, message: "Missing Email or Password" });
    return;
  }

  const encryptedPassword = bcrypt.hashSync(NewPassword, 10);

  try {
    const user = await User.findOne({ Email: Email });
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

router.delete("/delete/:id", validIdCheck, async function (req, res, next) {
  try {
    await User.findOneAndDelete({ _id: id });
    res.status(201).json({ error: false, message: "Success" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});

module.exports = router;
