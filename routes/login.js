var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


/* GET login listing. */
router.post('', function(req, res, next) {
    req.db
    .select("")
    .from("user")
    .where("username",req.body.username)
    .then(async (results) =>{
      if(results.length > 0 && results[0].password == req.body.password){
        const token = await jwt.sign(
            {
                username: results[0].username,
                userId: results[0].id,
                userCompanyId: results[0].companyid,
                userType: "employees"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            },
        )
        res.cookie("token", token, {httpOnly: true, maxAge: 3600000})
        res.status(200).json({"message": "Success", "username": results[0].username, "userCompanyId": results[0].companyid})
      }
      else{
        res.status(400).json({"message": "Failed"})
      }
    });
});

module.exports = router;