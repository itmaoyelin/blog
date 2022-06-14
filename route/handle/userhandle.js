const { User } = require('../../model/user'); //导入用户集合模块
//引入加密模块
const bcrypt = require('bcryptjs');

const { userSchema,pwdSchema } = require('../../model/schema');


//用户登录处理函数
const postLogin = (req, res) => {
    //对象解构
    const { email, password } = req.body;
    //封装错误处理函数
    function resErr() {
        res.status(400).render('admin/error', { msg: '邮件地址或密码错误！' });
    };
    //服务器端二次验证
    if (email.trim().length == 0 || password.trim().length == 0) {
        return resErr();
    }
    User.findOne({ email: email }).then(result => {
        // console.log(result);
        if (result.password === password || bcrypt.compareSync(password, result.password)) {
            /* //重定向
            res.writeHead('301', {
                Location: '/admin/user',
            });
           return  res.send(); */
           req.app.locals.userInfo = result; //将变量设置到app.locals对象下，这个数据在所有模板中都可以获取到
     
            //判断用户角色
            if (result.role == 'admin' && result.state == 0) {
                req.session.username = result.username; //把用户名存储在req.session对象中
                req.session.role = result.role;
                req.session.state = result.state;
                 //重定向到博客后台管理
                 return res.redirect('/admin/user');
            }
            else {
                //重定向到博客首页
                return res.redirect('/home');
            }
        }
        return resErr();
    }).catch(err => {
        // console.log(err);
        return resErr();
    })
};

//用户列表页面分页处理函数
const getUser = async (req, res) => {

    //标识 当前访问的使用管理页面
    req.app.locals.currentLink = 'user';
    //接收客户端传递过来的当前页参数
    let page = req.query.page||1;
    //每一页显示的数据条数
    let pagesize =req.query.pagesize||10;
    //查询用户数据的总数
    let count =await User.countDocuments();
   //总页数
    let total = Math.ceil(count / pagesize); //向上取整
    //页码对应的数据查询开始位置
    let start = (page - 1) * pagesize;

    //查询用户集合中所有文档   limit()限制查询数量，skip()跳过多少条数据//传入显示数据的开始位置
    User.find().limit(pagesize).skip(start).then(result => {
        // console.log(result)
        res.render('admin/user', { users: result, count:count ,page:page,total:total,pagesize:pagesize});
    });
};

//用户编辑路由处理函数
const getUserEdit = async (req, res) => {

     //标识 当前访问的使用管理页面
     req.app.locals.currentLink = 'user';
    //获取当前地址栏中的id参数
    const { message, id } = req.query;
    //如果当前传递了id参数
    if (id) {
        //修改操作
        let user = await User.findOne({ _id: id });
        // console.log(user);
        return res.render('admin/user-edit', {
            user: user,
            message: message,
            link: '/admin/user-update?id='+id,
            button:'修改',
        });
    }else{
        //添加操作
        return res.render('admin/user-edit', {
            message: message,
            link: '/admin/user-add',
            button:'添加',
        });
    }
   
};

//用户添加处理函数
const postUserAdd = async (req, res,next) => {

    const userInfo = req.body;
    
    //实施验证用户对象
    userSchema.validateAsync(userInfo)
        .then(result => {
            // res.redirect(`/admin/user-edit?message=用户信息验证已通过`);
            // res.send("OK");
            console.log('用户验证信息通过');
            
        })
        .catch(err => {
            // console.log(err.message);
            // res.redirect(`/admin/user-edit?message=${err.message}`);
            //调用next()方法交给错误处理中间件处理  参数只能是一个字符串
            //将对象转换为JSON字符串
            next(JSON.stringify({path:'/admin/user-edit',message:err.message})); 
        });
    //判读用户是否存在
    let user = await User.findOne({ email: userInfo.email });
    if (user) {
        // return res.redirect(`/admin/user-edit?message=邮箱地址已占用`);
        //交给错误处理中间件处理
        return next(JSON.stringify({ path: '/admin/user-edit', message: '邮箱地址已占用' }));
    }
    //加密密码
    userInfo.password = bcrypt.hashSync(userInfo.password, 10);
    //创建用户
    User.create(userInfo).then((result) => {
        // console.log('用户创建成功！',result);
        console.log('用户创建成功!');
        res.redirect('/admin/user');
    }).catch((err) => {
        console.log(err);
    });
};

//用户修改处理函数
const postUserUpdate = async (req, res, next) => {
    // res.send('OK');
    let oldUser = await User.findOne({ _id: req.query.id });
    let { username, email, role, state, password } = req.body;
    //比对密码
    if (oldUser.password === password || bcrypt.compareSync(password, oldUser.password)) {
        //密码比对成功，更新用户信息
        await User.updateOne({ _id: req.query.id }, {
            username: username,
            email: email,
            role: role,
            state: state,
        });
        //将页面重定向到用户列表页面
        res.redirect('/admin/user');
    } else {
        //转换为JSON字符串交给错误处理
        next(JSON.stringify({ path: '/admin/user-edit', message: '密码比对失败,不能进行用户信息的修改', id: oldUser._id }));
    }
};

//用户删除处理函数
const getUserDelete = async (req, res) => {
    // console.log(req.query);
    await User.findOneAndDelete({ _id: req.query.id });
    //将页面重定向到用户列表页面
    res.redirect('/admin/user');
};

//获取用户密码处理函数
const getUserPwd = (req, res) => {
    res.render('admin/user-changepwd',{message:req.query.message});
};

//重置用户密码处理函数
const postUserChangePwd = async (req, res) => {
    // res.send(req.body);
    const { password,id } = req.body;
    //实施验证用户对象
   pwdSchema.validateAsync({password:password})
        .then(async(result) => {
            // res.send("OK");
            //加密新密码
            newPwd = bcrypt.hashSync(password, 10);
            //修改用户密码
            await User.updateOne({ _id: id }, { password: newPwd });  
            res.redirect('/admin/user');
            
        })
        .catch(err => {
            res.redirect(`/admin/user-pwd?message=${err.message}`); 
        });
}

//获取用户个人资料处理函数
const getUserPersonal = (req, res) => {
    res.render('admin/personal');
    // res.send('OK');
}
//将函数方法暴露出去
module.exports = {
    postLogin,
    getUser,
    getUserEdit,
    postUserAdd,
    postUserUpdate,
    getUserDelete,
    getUserPwd,
    postUserChangePwd,
    getUserPersonal,
}