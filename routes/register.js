var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


/* GET login listing. */
router.post('/user/', function(req, res, next) {
    req.db
    .select("username")
    .from("user")
    .where("username",req.body.username)
    .then(async (results) =>{
      if(results.length > 0){
        res.status(401).json({"message": "User already exists"})
      }else{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        req.db("user")
        .insert({username: req.body.username, password: hashedPassword, companyid: req.body.companyid, pendingStatus: "pending"})
        .then((results) => {
          res.status(200).json({"message": results})
        })
      }
    });
});

router.post('/company/', function(req, res, next) {
    req.db
    .select("")
    .from("company")
    .where("name",req.body.name)
    .then(async (results) =>{
        if(results.length > 0){
          res.status(401).json({"message": "Company already exists"})
        }else{
          req.db("company")
          .insert({name: req.body.name})
          .then((results) => {
            res.status(200).json({"message": "Success"})
          })
        }
      });
});


router.post('/device/', function(req, res, next) {
    req.db
    .select("")
    .from("device")
    .where("username",req.body.username)
    .then(async (results) =>{
        if(results.length > 0){
          res.status(401).json({"message": "Device already exists"})
        }else{
          req.db("device")
          .insert({token: req.body.token, pendingStatus:"pending", companyid: req.body.companyid})
          .then((results) => {
            res.status(200).json({"message": "Success"})
          })
        }
      });
});


module.exports = router;