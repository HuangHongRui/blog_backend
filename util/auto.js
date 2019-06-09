const redis = require('redis');
const service = require("../routes/request");
const redis_client = redis.createClient();

module.exports = {

  /**
   *  功能: 抽取iSSUES使用数据
   *  日期: 2019-05-04
   */
  getIssues: function () {

    service.getIssues(function (err, issues) {
      if (err) return next(err);
      let data = JSON.parse(issues) || {};
      Object.keys(data).length && (data = data.map((data, idx) => {
        if (data.labels && data.labels.find(item => (item.name === 'Blog'))) {
            return {
              id: data.id,
              title: data.title,
              labels: data.labels,
              intro: data.body.match(/\*\*(.+)\*\*\r\n---/)[1],
              body: data.body.match(/\*.+\r\n---\r\n\r\n([\s\S]*)/)[1],
              date: data.created_at.match(/^\d+[-]\d.[-]\d./g)[0]
            }
          }
      }))
      redis_client.set("issues", JSON.stringify(data), redis.print)
    })

  }

}