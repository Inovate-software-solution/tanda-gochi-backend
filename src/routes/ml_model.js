const express = require("express");

const router = express.Router();

import * as controllers from "../controllers/ml_modelControllers.js";

router.get("/predict/late", controllers.latePrediction);
