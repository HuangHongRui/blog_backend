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

  generateResult: function(status, message, data) {
    return {
      status: status,
      message: message,
      data: data
    }
  }

};


// issuesData = [
//   {
//     "url": "https://api.github.com/repos/HuangHongRui/Leos/issues/5",
//     "repository_url": "https://api.github.com/repos/HuangHongRui/Leos",
//     "labels_url": "https://api.github.com/repos/HuangHongRui/Leos/issues/5/labels{/name}",
//     "comments_url": "https://api.github.com/repos/HuangHongRui/Leos/issues/5/comments",
//     "events_url": "https://api.github.com/repos/HuangHongRui/Leos/issues/5/events",
//     "html_url": "https://github.com/HuangHongRui/Leos/issues/5",
//     "id": 437955529,
//     "node_id": "MDU6SXNzdWU0Mzc5NTU1Mjk=",
//     "number": 5,
//     "title": "文章标题",
//     "user": {
//       "login": "HuangHongRui",
//       "id": 26321899,
//       "node_id": "MDQ6VXNlcjI2MzIxODk5",
//       "avatar_url": "https://avatars1.githubusercontent.com/u/26321899?v=4",
//       "gravatar_id": "",
//       "url": "https://api.github.com/users/HuangHongRui",
//       "html_url": "https://github.com/HuangHongRui",
//       "followers_url": "https://api.github.com/users/HuangHongRui/followers",
//       "following_url": "https://api.github.com/users/HuangHongRui/following{/other_user}",
//       "gists_url": "https://api.github.com/users/HuangHongRui/gists{/gist_id}",
//       "starred_url": "https://api.github.com/users/HuangHongRui/starred{/owner}{/repo}",
//       "subscriptions_url": "https://api.github.com/users/HuangHongRui/subscriptions",
//       "organizations_url": "https://api.github.com/users/HuangHongRui/orgs",
//       "repos_url": "https://api.github.com/users/HuangHongRui/repos",
//       "events_url": "https://api.github.com/users/HuangHongRui/events{/privacy}",
//       "received_events_url": "https://api.github.com/users/HuangHongRui/received_events",
//       "type": "User",
//       "site_admin": false
//     },
//     "labels": [
//       {
//         "id": 1338304016,
//         "node_id": "MDU6TGFiZWwxMzM4MzA0MDE2",
//         "url": "https://api.github.com/repos/HuangHongRui/Leos/labels/Blog",
//         "name": "Blog",
//         "color": "fef000",
//         "default": false
//       }
//     ],
//     "state": "open",
//     "locked": false,
//     "assignee": null,
//     "assignees": [],
//     "milestone": null,
//     "comments": 0,
//     "created_at": "2019-04-27T15:38:47Z",
//     "updated_at": "2019-04-27T15:38:47Z",
//     "closed_at": null,
//     "author_association": "OWNER",
//     "body": "**简介描述**\r\n---\r\n\r\n文章内容."
//   }
// ];

// {
//   this.issuesData.map((data, i) => (
//     <div key={i} className="article-item">
//       <Link to={data.url}>
//         <h4
//           onMouseEnter={() => this.onHoverTitle(i)}
//           onMouseLeave={this.onHoverTitle}
//           className={hoverTitleColor === i || hoverArticleColor === i ? "hover-select" : ""}
//         >
//           {data.title}
//         </h4>
//         <h6
//           onMouseEnter={() => this.onHoverTitle(i)}
//           onMouseLeave={this.onHoverTitle}
//           className={hoverTitleColor === i || hoverArticleColor === i ? "hover-select" : ""}
//         >
//           {data.labels.map(e => e.name)}
//         </h6>
//         <p
//           onMouseEnter={() => this.onHoverArticle(i)}
//           onMouseLeave={this.onHoverArticle}
//           className={hoverArticleColor === i ? "hover-select" : ""}
//         >
//           {data.body.match(/\*\*(.+)\*\*\r\n---/)[1]}
//         </p>
//       </Link>
//       <span>{data.created_at.match(/^\d+[-]\d.[-]\d./g)[0]}</span>
//     </div>
//   ))
// }