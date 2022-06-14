//引入joi模块
const Joi = require('joi');

//定义对象验证规则
const userSchema =Joi.object({
    
    username: Joi.string().min(2).max(5).required().error(new Error('用户名属性验证不通过!')), //自定义错误
    birth: Joi.number().min(1900).max(2022).required().error(new Error('birth属性验证不通过!')),
})
//实施验证
// Joi.validate({ username: '张三' }, userSchema);  //返回promise对象

//使用异步函数
/* async function run() {
    try{
        const value = await userSchema.validateAsync({ username: '张三',birth:'2025' }); //返回promise对象
        console.log(value);
    } catch(err) {
        // console.log('验证错误：'+err.details[0].message);
        console.log(err.message);
        return;//阻止程序向下执行
    }
    console.log('验证通过');
};
run(); */

// 使用then和catch捕获
userSchema.validateAsync({ username: '张三', birth: '1500' })
    .then(result => {
        console.log(result);
    })
    .catch(err => {
        console.log(err.message);
    });