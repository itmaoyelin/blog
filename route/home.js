//博客前台展示路由

const express = require('express');//引入express框架
const homeRouter = express.Router();//创建路由
//导入文章处理函数模块
const { getHome, getArticle } = require('./homehandle/homeArticle');
//导入评论处理函数模块
const { postComment } = require('./homehandle/comment');

//挂载二级路由
//博客首页展示
homeRouter.get('/',getHome);
//博客文章详情页展示
homeRouter.get('/article', getArticle);
//博客评论路由
homeRouter.post('/comment', postComment);

//将路由对象作为模块成员进行导出
module.exports = homeRouter;