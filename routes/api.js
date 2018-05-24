var express = require('express');
var router = express.Router();
var redis = require('redis');
var db = redis.createClient();
var app = express();
/*
 |--------------------------------------------------------------------------
 | 在线人数
 |--------------------------------------------------------------------------
 */
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

router.get('/online', function (req, res, next) {
  res.status(200);
  res.type('application/json');
  res.json({
    state: `1`,
    message: '当前在线人数',
    online: `${req.online.length}`
  });
});

module.exports = router;
