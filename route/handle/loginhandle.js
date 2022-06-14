//登录页面路由处理函数
const getLogin = (req, res) => {
    // res.send("欢迎来到博客管理页面！");
    res.render('admin/login');
};

//用户退出函数处理
const getLogout = (req, res) => {
  
    //清除模板中的用户信息
    req.app.locals.userInfo = null;
      //清空当前客户端对应的session信息
    req.session.destroy(function(){
        //删除cookie
        res.clearCookie('connect.sid');
        res.redirect('/home/'); //重定向
      });
    
};

//向外暴露共享函数方法
module.exports = {
    getLogin,
    getLogout,
}