var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var stylus = require('stylus');
const redis = require('redis');
const session = require('express-session');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');
const privateConfig = require('./privateConfig');

const app = express();
const db = redis.createClient();

app.use(session(privateConfig.elseConfig.session));

app.use(function (req, res, next) {
  var ua = req.headers['user-agent'];
  db.zadd('online', Date.now(), ua, next);
});

app.use(function (req, res, next) {
  var min = 60 * 1000;
  var ago = Date.now() - min;
  db.zrevrangebyscore('online', '+inf', ago, function (err, users) {
    if (err) return next(err);
    req.online = users;
    next();
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);
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
