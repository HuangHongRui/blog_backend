const express = require("express");
const redis = require("redis");
const dbMethods = require("../database/dbMethods");
const dbMySqlMethods = require("../database/dbMysqlMethods");
const sendEmail = require("../util/email");
const Methods = require("../util/methods");
const redis_client = redis.createClient();
const router = express.Router();
const service = require("./request");
const privateConfig = require('../privateConfig');


/**
 *  功能: 在线人数
 */
router.get("/online", function (req, res, next) {
  res.status(200);
  res.type("application/json");
  res.json({
    status: 1,
    message: "当前在线人数",
    online: `${req.online.length}`
  });
});

/**
 *  功能: 运行历史时间
 */
router.get("/runtime", (req, res, next) => {
  res.status(200);
  res.type("application/json");
  res.json({
    status: 1,
    message: "运行历史时间",
    unit: "毫秒",
    runtime: Date.parse(new Date()) - Date.parse(new Date("2018-05-01T09:06:07"))
  });
});

router.get("/test", (req, res, next) => {
  redis_client.set("redis-leo", "123", "EX", 5, "NX", (err, res) => {
  });
  res.json({});
});

router.get("/get", (req, res, next) => {
  redis_client.get("hhr464362353@gmail.com_redis", function (err, res) {
  });
  res.json({});
});

router.get("/del", (req, res, next) => {
  redis_client.del("hhr464362353@gmail.com_redis", function (err, res) {
  });
  res.json({});
});

/**
 *  功能: 验证邮箱
 *  参数: email
 *  简介: 用于注册时/找密时的验证
 */
router.get("/account_verify_email", (req, res, next) => {
  let {email} = req.query;
  let resultData = Methods.generateResult(0, "邮箱未注册");
  dbMethods.query(dbMySqlMethods.verifyEmail, [email], function (err, result) {
    if (result.length)
      resultData = Methods.generateResult(1, "邮箱已注册");
    res.json(resultData);
  });
});

/**
 *  功能: 发送邮件_注册验证码
 **/
router.get("/account_send_email", (req, res, next) => {
  let {email} = req.query;
  let resultData = Methods.generateResult(0, "验证码有效期5分钟，请5分钟后再试");
  redis_client.get(email + "_redis", (err, reply) => {
    if (email && reply) {
      //  如果有那么不发邮件了...
      res.json(resultData);
    } else {
      let vCode = Methods.generateCode(6);
      redis_client.set(email + "_redis", vCode, "EX", 300, "NX");
      sendEmail({email_tag: email, vCode: vCode}, (result, txt) => {
        res.json({ status: result, message: txt });
      });
    }
  });
});

/**
 *  功能: 验证验证码
 *  参数: vCode
 **/
router.get("/account_verify_code", (req, res, next) => {
  let {email, vCode} = req.query;
  let resultData = Methods.generateResult(0, "验证码错误");
  redis_client.get(email + "_redis", function (err, reply) {
    if (reply && reply === vCode)
      resultData = Methods.generateResult(1, "验证成功");
    res.json(resultData);
  });
});

/**
 *  功能: 注册账号
 *  参数: nickname
 *  参数: email
 *  参数: password
 **/
router.post("/account_sign_up", (req, res, next) => {
  let {nickname, email, password} = req.body;
  let resultData = Methods.generateResult(0, "注册失败");

  dbMethods.query(dbMySqlMethods.verifyEmail, [email], function (err, result) {
    if (result.length) {
      let resultData = Methods.generateResult(0, "注册失败，账号已注册。");
      res.json(resultData);
      return;
    }

    dbMethods.query(dbMySqlMethods.sign_up, [nickname, email, password], function (err, result) {
      if (result && !err)
        resultData = Methods.generateResult(1, "注册成功");
      res.json(resultData);
    });
  });
});

/**
 *  功能: 登录账号
 *  参数: account
 *  参数: password
 **/
router.post("/account_sign_in", (req, res, next) => {
  let {email, password} = req.body;
  let resultData = Methods.generateResult(0, "登录失败，账号或密码错误。");

  dbMethods.query(dbMySqlMethods.verifyEmail, [email], function (err, result) {
    if (!result.length) {
      let resultData = Methods.generateResult(0, "登录失败，账号未注册。");
      res.json(resultData);
      return;
    }

    dbMethods.query(dbMySqlMethods.login, [email, password], function (err, result) {
      if (result.length) {
        req.session.userName = req.sessionID;
        resultData = Methods.generateResult(1, "登录成功");
      }
      res.json(resultData);
    });
  });
});

/**
 *  功能: 是否登录
 *  日期：2019-03-09
 *  文件：api
 *  參數：
 */
router.get("/account_is_login", (req, res) => {
  let resultData = Methods.generateResult(0, "认证失败");
  if (req.session.userName === req.sessionID) {
    let data = JSON.parse(req.session.userData);
    resultData = Methods.generateResult(1, "认证成功", data);
  }
  res.json(resultData);
});

router.get("/forget", (req, res, next) => {
  dbMethods.query(dbMySqlMethods.createTable, undefined, function (err, result) {
    console.log("查询结果：", result);
  });
});

/**
 *  功能: 第三方登录（GITHUB）
 *  日期: 2019-04-20
 *  @params：code
 */
router.get("/social_login", (req, res) => {
  const {code} = req.query;
  if (code) {
    const config = Object.assign(privateConfig.github, {code: code});
    service.gitOauth(config, function(err, token) {
      if (err) return next(err);
      service.gitUserInfo(token.access_token, function(err, userinfo) {
        if (err) return next(err);
        req.session.userName = req.sessionID;
        req.session.userData = userinfo;
        res.redirect(301, 'http://local.sunnyman.club:8000');
      })
    })
  }

});

module.exports = router;
