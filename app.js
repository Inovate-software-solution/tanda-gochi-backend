const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const options = require("./knex.js");
const knex = require("knex")(options);
const jwt = require("jsonwebtoken");
const chalk = require("chalk");
const moment = require("moment");
const cors = require("cors");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users.js");
const devicesRouter = require("./routes/devices.js");
const companiesRouter = require("./routes/companies.js");
//const loginRouter = require("./routes/login");
//const registerRouter = require("./routes/register");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
//knex middleware
app.use((req, res, next) => {
  req.db = knex;
  next();
});
app.use((req, res, next) => {
  req.jwt = jwt;
  next();
});
// view engine setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  logger(function (tokens, req, res) {
    return [
      chalk.white(moment().format("DD/MM/YY HH:mm:ss")),
      chalk.yellow(tokens["remote-addr"](req, res)),
      chalk.green.bold(tokens.method(req, res)),
      tokens.status(req, res) >= 500
        ? chalk.red.bold(tokens.status(req, res))
        : tokens.status(req, res) < 500 && tokens.status(req, res) >= 400
        ? chalk.yellow.bold(tokens.status(req, res))
        : tokens.status(req, res) < 400 && tokens.status(req, res) >= 300
        ? chalk.blue.bold(tokens.status(req, res))
        : chalk.green.bold(tokens.status(req, res)),
      chalk.white(tokens.url(req, res)),
      chalk.yellow(tokens["response-time"](req, res) + " ms"),
    ].join(" ");
  })
);

//app.use("/login", loginRouter);
//app.use("/register", registerRouter);
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/devices", devicesRouter);
app.use("/companies", companiesRouter);

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
    return res.status(404).json({
      error: true,
      message: "Route not found!",
    });
  } else {
    res.status(err.status || 500).json({
      error: true,
      message:
        "Internal server error, contact the software engineer! The errors was handled by generic error handler",
    });
  }
  // render the error page
});

module.exports = app;
