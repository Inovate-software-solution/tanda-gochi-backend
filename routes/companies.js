const express = require("express");
const router = express.Router();

router.post("/register", (req, res, next) => {
  req.db
    .select()
    .from("company")
    .where("name", req.body.name)
    .then((results) => {
      if (results.length > 0) {
        res
          .status(401)
          .json({ error: true, message: "Company already exists" });
      } else {
        req.db
          .from("company")
          .insert({ Name: req.body.Name })
          .then(() => {
            res
              .status(200)
              .json({ error: false, message: "Company registered" });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: true,
              message:
                "Internal SQL error on company register, please contact software engineer",
            });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: true,
        message:
          "Internal SQL error on company register, please contact software engineer",
      });
    });
});

module.exports = router;
