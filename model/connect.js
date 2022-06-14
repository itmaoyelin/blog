//连接数据库
const mongoose = require('mongoose'); //引入mongoose模块

//连接本机数据库 包含项目数据库账号密码
/* mongoose.connect('mongodb://itmao:123456@127.0.0.1:27017/blog')
    .then(() => console.log('mongodb数据库连接成功!'))
    .catch(() => console.log('mongodb数据库连接失败!')); */

//连接本机数据库 包含项目数据库账号密码
//导入第三方config模块  
const config = require('config');
// 再通过模块字符串拼接出数据库地址
 mongoose.connect(`mongodb://${config.get('db.user')}:${config.get('db.pwd')}@${config.get('db.host')}:${config.get('db.port')}/${config.get('db.name')}`)
    .then(() => console.log('mongodb数据库连接成功!'))
    .catch(() => console.log('mongodb数据库连接失败!')); 