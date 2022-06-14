const guard = (req, res, next) => {
    //判断请求地址是否是login和是否已登录
    if (req.url != '/login' && !req.session.username) {
        if (req.url == '/logout') {
            //重定向到登录页面
          return  next();
        }
        //重定向到登录页面
        res.redirect('/admin/login');
    } else {
        //如果用户是普通用户
        if (req.session.role == 'normal'||req.session.state==1) {
            return redirect('/home/');
        }
        //用户是管理员登录状态 将请求放行
        next();
    }
};

module.exports = guard;