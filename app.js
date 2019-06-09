const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const stylus = require('stylus');
const redis = require('redis');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const schedule = require('node-schedule');
const privateConfig = require('./privateConfig');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const apiRouter = require('./routes/api');
const autoReq = require('./util/auto')
const app = express();
const redis_client = redis.createClient();

app.use(session(privateConfig.elseConfig.session));

app.use(function (req, res, next) {
  var ua = req.headers['user-agent'];
  redis_client.zadd('online', Date.now(), ua, next);
});

app.use(function (req, res, next) {
  var min = 60 * 1000;
  var ago = Date.now() - min;
  redis_client.zrevrangebyscore('online', '+inf', ago, function (err, users) {
    if (err) return next(err);
    req.online = users;
    next();
  });
});

//  整点执行一次
schedule.scheduleJob('0/5 * * * *', autoReq.getIssues);

// view engine setup
app.use(cookieParser());
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
