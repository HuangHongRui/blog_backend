/**
 *  Author: leo
 *  Intro: 请求第三方接口
 *  Date：2019-04-21
 *  File：request
 */

let http = require("http");
const request = require("request");

/**
 *  Intro: 测试请求其他服务器
 *  Date：2019-04-21
 *  @params：FUNCTION fn
 */
function test(fn) {

  let http_request = {
    host: "dushu.xiaomi.com",
    port: 80,
    path: "/store/v0/lib/query/onebox?"
  };
  http.request(http_request, function (_res) {
    let content = "";
    _res.setEncoding("utf-8");
    _res.on("data", function (chunk) {
      content += chunk;
    });
    _res.on("end", function () {
      return fn(null, content);
    });
  }).end();

};

/**
 *  Intro: 获取GITHUB登录权限
 *  @params：{OBJECT} config
 *  @params：{FUNCTION} fn
 *  APILink: https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/
 */
function gitOauth(config, fn) {

    request.post({
      header: {"content-type": "application/x-www-form-urlencoded"},
      url: "https://github.com/login/oauth/access_token",
      json: config,
    }, function (err, res, body) {
      return fn(err, body);
    })

}

/**
 *  Intro: 获取GITHUB用户基本信息
 *  @params：{String}  token
 */

function gitUserInfo(token, fn) {

  request.get({
    url: "https://api.github.com/user",
    qs: {access_token: token},
    headers: {
      "Accept": "application/json",
      "User-Agent": "blog"
    }
  }, function (err, res, body) {
    return fn(err, body);
  });

}

module.exports = {
  test: test,
  gitOauth: gitOauth,
  gitUserInfo: gitUserInfo
};