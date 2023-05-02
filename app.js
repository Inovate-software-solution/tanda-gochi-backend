var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var options = require('./knex.js');
var knex = require('knex')(options);
var jwt = require('jsonwebtoken');
require('dotenv').config()

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');


var app = express();

//Use this line in dev env only! This is to by pass all the cors errors
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//knex middleware
app.use((req, res, next) => {
  req.db = knex;
  next();
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', loginRouter);
app.use('/register', registerRouter);

//Middleware to check if the user is logged in
app.use(
  function (req, res, next) {
    try {
      const token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userData = decoded;
      if (req.userData.userType == "employees") {
        next();
      }
      else {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
    } catch (err) {
      return res.status(401).json({
        message: "Auth failed"
      });
    }
  }
)

//Getting info about the user and the company route here

app.use('/', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
