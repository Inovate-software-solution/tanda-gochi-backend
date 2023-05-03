const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const key = require("../secret_key.json");

router.get("", function (req, res, next) {
  req.db
    .select("")
    .from("user")
    .then((results) => {
      res.status(200).json(results);
    });
});

router.post("/login", function (req, res, next) {
  const jwt = req.jwt;
  const Username = req.body.Username;
  const Password = req.body.Password;
  if (!Username || !Password) {
    res.status(400).json({
      error: true,
      message: "Both username and password are required",
    });
    return;
  }
  req.db
    .select("")
    .from("user")
    .where("Username", Username)
    .then((results) => {
      if (results.length === 0) {
        res
          .status(401)
          .json({ error: true, message: "Incorrect username or password" });
        return;
      }
      if (bcrypt.compareSync(Password, results[0].Password)) {
        const expires_in = 60 * 60 * 3;
        const exp = Date.now() + expires_in * 1000;
        const token = jwt.sign(
          {
            Username: results[0].Username,
            Id: results[0].Id,
            CompanyId: results[0].CompanyId,
            userType: "employees",
            exp: exp,
          },
          key.key
        );
        res.status(200).json({
          message: "Success",
          token: "Bearer" + " " + token,
        });
      } else {
        res
          .status(401)
          .json({ error: true, message: "Incorrect username or password" });
        return;
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ error: true, message: "Internal SQL errors on Login" });
    });
});

router.post("/register", function (req, res, next) {
  const Username = req.body.Username;
  const Password = req.body.Password;
  req.db
    .select("")
    .from("user")
    .where("Username", Username)
    .then((results) => {
      if (results.length > 0) {
        res.status(401).json({ message: "User already exists" });
      } else {
        const hashedPassword = bcrypt.hashSync(Password, 10);
        req
          .db("user")
          .insert({
            Username: Username,
            Password: hashedPassword,
            CompanyId: req.body.companyid,
            PendingStatus: "pending",
          })
          .then(() => {
            res
              .status(200)
              .json({ error: false, message: "Success, user created" });
          })
          .catch((err) => {
            console.log(err);
            res
              .status(500)
              .json({ error: true, message: "Internal SQL error on register" });
          });
      }
    });
});

module.exports = router;
