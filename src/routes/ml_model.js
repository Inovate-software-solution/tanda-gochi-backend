const express = require("express");
import authorize from "../middleware/authorize.js";
const router = express.Router();

import * as controllers from "../controllers/ml_modelControllers.js";

router.get("/predict", authorize(["user"]), controllers.latePrediction);

module.exports = router;
