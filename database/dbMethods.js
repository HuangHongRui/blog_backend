let mysql = require('mysql');//引入mysql模块
let {dbConfig = {}} = require('../privateConfig');  //引入数据库配置模块中的数据

//向外暴露方法
module.exports = {
  query : function(sql, valueAry, callback){
    let pool = mysql.createPool(dbConfig);
    pool.getConnection(function(err,connection){
      if(err){
        console.log('数据库链接失败', err);
        // throw err;
        return;
      }
      connection.query( sql, valueAry, function(err,results,fields ){
        connection.release();
        if(err){
          console.log('数据操作失败', err);
          // throw err;
          return;
        }
        callback && callback(results, fields);
      });
    });
  }
};