// CRUD SQL语句
var user = {
  INSERT:'INSERT INTO user(id, nickname, email, password) VALUES(0,?,?,?)',
  update:'update user set nickname=?, email=?, password=? where id=?',
  delete: 'delete from user where id=?',
  queryById: 'select * from user where id=?',
  queryAll: 'select * from user',

  // createTable: 'create table user(\n' +
  //   '\tid int unsigned not null auto_increment primary key,\n' +
  //   '\tnickname char(10) not null,\n' +
  //   '\temail char(50) not null,\n' +
  //   '\tpassword char(50) not null\n' +
  //   ');;',
  // deleteTable: 'DROP TABLE user',
  // login: 'SELECT * FROM user WHERE nickname=? or email=?',

  sign_up:'INSERT INTO user(id, nickname, email, password) VALUES(0,?,?,?)',
  login: 'SELECT * FROM user WHERE (email=?) And password=?',
  verifyEmail: 'SELECT * FROM user WHERE email=?'


};

module.exports = user;