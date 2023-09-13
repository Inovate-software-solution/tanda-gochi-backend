const chalk = require("chalk");
const moment = require("moment");
const logger = require("morgan");

const RequestLogger = logger(function (tokens, req, res) {
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
});

module.exports = RequestLogger;
