module.exports = {

  /**
   *  功能: 生成验证码
   *  參數：num 生成验证码的长度
   */
  generateCode: function (num) {
    var allCode = "azxcvbnmsdfghjklqwertyuiopZXCVBNMASDFGHJKLQWERTYUIOP0123456789";
    var resultCode = "";
    for (let i = 0; i < num; i++) {
      let index = Math.floor(Math.random() * 62);
      resultCode += allCode.charAt(index);
    }
    return resultCode;
  },

  generateResult: function(state, message) {
    return {
      state: state,
      message: message
    }
  }

};