let express = require('express');
let redis = require('redis');
let dbMethods = require('../database/dbMethods');
let dbMySqlMethods = require('../database/dbMysqlMethods');
let sendEmail = require('../src/email');
let Methods = require('../util/methods');
let redis_client = redis.createClient();
let router = express.Router();
let app = express();

/*
 |--------------------------------------------------------------------------
 | 在线人数
 |--------------------------------------------------------------------------
 */
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
});

router.get('/test', (req, res, next) => {
  redis_client.set( 'redis-leo', '123', 'EX', 5, 'NX', (err, res) => {
    console.log("☞☞☞ 9527 api 60", res);
  });
  res.json({})
});

router.get('/get', (req, res, next) => {
  redis_client.get('hhr464362353@gmail.com_redis', function(err, res) {
    console.log("☞☞☞ 9527 api 64", res);
    if (res) console.log("☞☞☞ 9527 api 67", 'heihei');
  });
  res.json({})
});

router.get('/del', (req, res, next) => {
  redis_client.del('hhr464362353@gmail.com_redis', function(err, res) {
    console.log("☞☞☞ 9527 api 64", res);
    if (res) console.log("☞☞☞ 9527 api 75", 'del Done');
  });
  res.json({})
});


/**
 *  功能: 注册账号
 *  参数: nickname
 *  参数: email
 *  参数: password
 **/
router.get('/register', (req, res, next) => {
  let {nickname, email, password} = req.query;
  dbMethods.query(dbMySqlMethods.register,[nickname, email, password], function(result, fields){
    res.json({
      state: 1,
      message:  "注册成功"
    })
  });
});

/**
 *  功能: 登录账号
 *  参数: account
 *  参数: password
 **/
router.get('/login', (req, res, next) => {
  let {account, password} = req.query;
  dbMethods.query(dbMySqlMethods.login,[account, account, password], function(result){
    let stateVar = result.length ? 1 : 0;
    let messageVar = result.length ? '登录成功。' : '登录失败，账号或密码错误。';
    res.json({
      state: stateVar,
      message: messageVar,
    })
  });
});

/**
 *  功能: 验证邮箱
 *  参数: email
 *  简介: 用于注册时/找密时的验证
 */
router.get('/verifyEmail', (req, res, next) => {
  let {email} = req.query;
  dbMethods.query(dbMySqlMethods.verifyEmail, [email], function(result){
    let stateVar = result.length ? 1 : 0;
    let messageVar = result.length ? '邮箱已注册' : '邮箱未注册';
    res.json({
      state: stateVar,
      message: messageVar,
    })
  });
});


/**
 *  功能: 发送邮件_注册验证码
 **/
router.get('/sendEmail', (req, res, next) => {
  let {email} = req.query;

  redis_client.get( email + '_redis', (err, reply) => {
    if (reply) {
      console.log("☞☞☞ 9527 api 141", reply);
    //  如果有那么不发邮件了...
      res.json({
        state: 0,
        message: '间隔1分钟才可以发送新验证码。'
      })
    } else {
      let vCode = Methods.generateCode(6);
      redis_client.set( email + '_redis', vCode, 'EX', 60, 'NX');
      sendEmail({email_tag: email, vCode: vCode}, (result, txt) => {
        console.log("☞☞☞ 9527 api 153", 11111111);
        res.json({
          state: result,
          message: txt
        })
      });
    }
  });

});

router.get('/forget', (req, res, next) => {
  dbMethods.query(dbMySqlMethods.createTable,undefined, function(result, fields){
    console.log('查询结果：', result);
  });
});

module.exports = router;
