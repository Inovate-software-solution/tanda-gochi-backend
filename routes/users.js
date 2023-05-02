var express = require('express');
var router = express.Router();

/* POST login */
router.post('', function(req, res, next) {
  req.db
    .select("")
    .from("user")
    .where("username",req.body.username)
    .then((results) => {
      if(results.length > 0 && results[0].password == req.body.password){
        res.status(200).json({"message": "Success"})
      }
      else{
        res.status(400).json({"message": "Failed"})
      }
    });
});

module.exports = router;
