const express = require('express'); //引入express框架
const app = express(); //创建服务器
const path = require('path'); //引入path模块
const session = require('express-session');//导入session模块
const dateFormat = require('dateformat');//导入第三方模块
const template = require('art-template');//导入三方模块
const morgan = require('morgan');//导入三方模块
const config = require('config');//导入第三方模块config
require('./model/connect'); //引入数据库连接
app.use(express.static(path.join(__dirname, 'public')));//挂载静态资源服务器

console.log(config.get('title'));
//获取系统环境变量 返回值时对象
// console.log(process.env.NODE_ENV);
//判断当前环境
if (process.env.NODE_ENV == 'development') {
    //当前是开发环境
    console.log('当前是开发环境');
    //在开发环境中将客户端发送到服务器端的请求信息打印到控制台
    // app.use(morgan('dev'));
} else {
    //当前是生产环境
    console.log('当前是生产环境');
}


//导入body-parser 解析器中间件
const bodyParser = require('body-parser');
// 解析 application/x-www-form-urlencoded 格式数据
app.use(bodyParser.urlencoded({ extended: false }));
//解析 application/json 格式数据
app.use(bodyParser.json());

//配置session
app.use(session({
    secret: 'itmao', //任意字符串
    resave: false, //固定写法
    saveUninitialized: false, //固定写法
}));

//告诉express框架模板所在位置
app.set('views', path.join(__dirname, 'views'));
//告诉express框架模板的后缀是什么
app.set('view engine', 'art');
//当渲染后缀为art模板时 ,所使用的模板引擎是什么
app.engine('art', require('express-art-template'));
//向模板中导入变量 格式化时间
template.defaults.imports.dateFormat = dateFormat;

//引入路由模块
const homeRouter = require('./route/home');//引入博客前台路由模块
const adminRouter = require('./route/admin');//引入博客后台管理路由模块

// 拦截请求 判断用户登录状态  导入拦截模块
app.use('/admin',require('./middleware/loginGuard'));

//一级路由
app.use('/home', homeRouter);
app.use('/admin', adminRouter);

//错误处理中间件
app.use(require('./middleware/errorHandle'));

app.listen(8013, () => {  //监听8013端口
    console.log('server runing at http://127.0.0.1:8013');
})