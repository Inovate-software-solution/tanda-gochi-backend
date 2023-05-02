var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  req.db
    .select("")
    .from("user")
    .then((results) => {
      res.status(200).json({"message": results})
    });
  
});

module.exports = router;
