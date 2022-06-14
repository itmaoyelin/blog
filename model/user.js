//用户集合
const mongoose = require('mongoose'); //引入mongoose模块
require('./connect');//引入数据库连接
//引入加密模块
const bcrypt = require('bcryptjs');
//创建用户集合规则
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true, //必填项
        minlength: 2,
        maxlength: 10,
    },
    email: {
        type: String,
        unique: true,//保证唯一性
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
     
    },
    //admin超级管理员
    //normal普通用户
    role: {
        type: String,
        required: true,
    },
    //0为启用状态 1为禁用状态
    state: {
        type: Number,
        default: 0,
    }
});

//创建集合
const User = mongoose.model('User', userSchema);

const newUser=function() {
        //加密密码
        const password = bcrypt.hashSync('123456', 10);
        console.log(password);
        //创建用户
    User.create({
        username: '毛业林',
        email: '1280@qq.com',
        password: password,
        role: 'admin',
        state:0,
    }).then((result) => {
        console.log('用户创建成功！',result);
    }).catch((err) => {
        console.log(err);
    })
};
// 调用函数
// userCreat();

//将User集合作为模块向外导出
module.exports = {
    User: User,
    newUser,

}