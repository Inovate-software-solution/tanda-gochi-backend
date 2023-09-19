const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const RequestLogger = require("./middleware/logger");

require("dotenv").config();

// Swagger documentation
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const YAML = require("yaml");
const file = fs.readFileSync("./API_Documentation.yaml", "utf8");
const swaggerDocument = YAML.parse(file);

const mongoose = require("mongoose");

const clockingRouter = require("./routes/clocking.js");
const badgesRouter = require("./routes/badges.js");
const usersRouter = require("./routes/users.js");
const userActionsRouter = require("./routes/userActions.js");
const devicesRouter = require("./routes/devices.js");
const outfitsRouter = require("./routes/outfits.js");
const itemsRouter = require("./routes/items.js");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());

const TandaAPI = "https://my.tanda.co/api/v2";

// Mongoose connection
async function connectToDatabase() {
  if (process.env.NODE_ENV === "test") return;
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING, {
      dbName: "tanda",
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
    process.exit(1); // Exit the process with failure code
  }
}

connectToDatabase();

// view engine setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  req.jwt = jwt;
  next();
});

app.use((req, res, next) => {
  req.TandaAPI = TandaAPI;
  next();
});

app.use(RequestLogger);

app.get("/", (req, res, next) => {
  res.redirect("/api/documentation");
});
app.get("/api", (req, res, next) => {
  res.redirect("/api/documentation");
});
app.use(
  "/api/documentation",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.use("/api/clocking", clockingRouter);
app.use("/api/users", usersRouter);
app.use("/api/user/action", userActionsRouter);
app.use("/api/devices", devicesRouter);
app.use("/api/badges", badgesRouter);
app.use("/api/outfits", outfitsRouter);
app.use("/api/items", itemsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  if (err.status === 404) {
    console.log(err.message);
    return res.status(404).json({
      error: true,
      message: "Route not found!",
    });
  } else {
    console.log(err.message);
    return res.status(err.status || 500).json({
      error: true,
      message:
        "Internal server error, contact the software engineer! The errors was handled by generic error handler",
    });
  }
});

module.exports = app;
