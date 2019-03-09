const nodemailer = require("nodemailer");
const {emailConfig = {}} = require("../privateConfig");

/**
 *  功能: 发送邮件
 *  参数: email_tag
 *  参数: vCode
 *  參數: subject_txt
 *  参数: callback
 */
function sendEmail(arg = {}, callback){
  const {
    email_tag,
    vCode = '0000',
    subject_txt = '注册验证码',
    // content_txt = '注册内容'
  } = arg;

  let transporter = nodemailer.createTransport({
    service: 'qq',
    secure: true,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.password
    }
  });

  let mailOptions = {
    from: emailConfig.fromText,
    to: email_tag,
    subject: subject_txt,
    text: vCode,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("☞☞☞ 9527 email 35", err);
      callback(0, '出现错误。');
    } else {
      console.log("☞☞☞ 9527 email 37", info);
      callback(1, '已发送。')
    }
  });
}

module.exports = sendEmail;
