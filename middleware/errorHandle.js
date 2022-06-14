const errorHandle = (err, req, res, next) => {
    //将字符串对象转换为对象类型
    const result = JSON.parse(err); //err接收到错误对象
    let params = [];
    //循环遍历对象
    for (let attr in result) {
        if (attr != 'path') {
            params.push(attr + '=' + result[attr]);
        }
    }
    //重定向处理
    res.redirect(`${result.path}?${params.join('&')}`); //数组元素通过&拼接
};

module.exports = errorHandle;