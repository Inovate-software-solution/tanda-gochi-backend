const express = require("express");
const router = express.Router();

/* GET users listing. */
router.post("/register", function (req, res, next) {
  req.db
    .select("")
    .from("device")
    .where("username", req.body.username)
    .then((results) => {
      if (results.length > 0) {
        res.status(401).json({ error: true, message: "Device already exists" });
        return;
      }
      req
        .db("device")
        .insert({
          token: req.body.token,
          PendingStatus: "pending",
          CompanyId: req.body.CompanyId,
        })
        .then(() => {
          res.status(200).json({ error: false, message: "Success" });
        });
    });
});

module.exports = router;
