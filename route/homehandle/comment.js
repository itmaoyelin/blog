const { Comment } = require('../../model/comment');//导入评论集合
//博客评论路由处理函数
const postComment = async(req, res) => {
    // console.log(req.body);
    const { content, uid, aid } = req.body;
    //将评论信息存储到评论集合中
    await Comment.create({
        uid: uid,
        aid: aid,
        content: content,
        time: new Date(),

    });
    //将页面重定向会详情页面
    res.redirect('/home/article?id=' + aid);
}


module.exports = {
    postComment,
}