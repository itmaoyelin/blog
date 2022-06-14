//博客后台管理路由
const express = require('express');//引入express框架
const { User } = require('../model/user');
const adminRouter = express.Router();//创建路由

//导入登录退出函数处理模块
const{ getLogin, getLogout }=require('./handle/loginhandle');
//导入用户函数处理模块
const {postLogin, getUser,getUserEdit,postUserAdd,postUserUpdate,getUserDelete,getUserPwd,postUserChangePwd,getUserPersonal} = require('./handle/userhandle');
//导入文章函数处理模块
const { getArticle,getArticleEdit, postArticleAdd,postArticleUpdate, getArticleDelete } = require('./handle/articlehandle');

//挂载二级路由 
//用户登录页面
adminRouter.get('/login', getLogin);
//用户登录路由
adminRouter.post('/login', postLogin);
//用户退出路由
adminRouter.get('/logout', getLogout); 
//用户路由
adminRouter.get('/user', getUser);
//用户编辑路由
adminRouter.get('/user-edit', getUserEdit);
//用户添加路由
adminRouter.post('/user-add', postUserAdd);
// 用户信息修改路由
adminRouter.post('/user-update', postUserUpdate);
//用户删除路由
adminRouter.get('/user-delete', getUserDelete);
//获取用户密码路由
adminRouter.get('/user-pwd', getUserPwd);
//用户密码重置路由
adminRouter.post('/user-changepwd', postUserChangePwd);
//获取用户个人资料
adminRouter.get('/user-personal', getUserPersonal);

//文章路由
adminRouter.get('/article',getArticle );
//文章编辑路由
adminRouter.get('/article-edit', getArticleEdit);
//文章添加路由
adminRouter.post('/article-add', postArticleAdd);
//文章修改路由
adminRouter.post('/article-update', postArticleUpdate);
//文章删除路由
adminRouter.get('/article-delete', getArticleDelete);




//将路由对象作为模块成员进行导出
module.exports = adminRouter;