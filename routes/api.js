let express = require('express');
let router = express.Router();
let redis = require('redis');
let db = redis.createClient();
let app = express();

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

/*
 |--------------------------------------------------------------------------
 | 运行历史时间
 |--------------------------------------------------------------------------
 */
router.get('/runtime', (req, res, next) => {
  res.status(200);
  res.type('application/json');
  res.json({
    state: 1,
    message: '运行历史时间',
    unit: '毫秒',
    runtime: Date.parse(new Date()) - Date.parse(new Date('2018-05-01T09:06:07'))
  })
})

module.exports = router;
