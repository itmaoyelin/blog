//引入规则验证模块joi
const Joi = require('joi');

//定义用户对象的验证规则
const userSchema = Joi.object({
    username: Joi.string().min(2).max(12).required().error(new Error('用户名不规范')),
    password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required().error(new Error('密码格式不规范')),
    email: Joi.string().email().required().error(new Error('邮箱格式不规范')),
    role: Joi.string().valid('admin', 'normal').required().error(new Error('角色值非法')),
    state: Joi.number().valid(0, 1).required().error(new Error('状态值非法')),  
});

//定义密码对象的验证规则
const pwdSchema = Joi.object({
    password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required().error(new Error('密码格式至少6位字母或数字')),
});

// 暴露对象给外部使用
module.exports = {
    userSchema,
    pwdSchema,
}
