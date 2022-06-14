  
  //引入文章集合
const { Article } = require('../../model/article');
//引入评论集合
const { Comment } = require('../../model/comment.js');
//导入分页模块
const pagination = require('mongoose-sex-page');

  //获取文章列表处理函数
const getHome = async (req, res) => {
    //接收客户端传递过来的页码
    const page = req.query.page;
    // res.send("欢迎来到博客首页！");
    const result = await pagination(Article).page(page).size(6).display(5).find().populate('author').exec();
    const Articles = JSON.stringify(result);
    // res.send(JSON.parse(Articles));
    res.render('home/default',{Articles:JSON.parse(Articles)});
};

//获取文章详情处理函数
const getArticle = async (req, res) => {
    // res.send("欢迎来到文章详情页!");
    //接收客户端传递过来的id
    const id = req.query.id;
    const result = await Article.findOne({ _id: id }).populate('author');
    const article = JSON.stringify(result);
    const comments = await Comment.find({ aid: id }).populate('uid');
    const comresult = JSON.stringify(comments);
    
    // res.send(comments);
    
    res.render('home/article', { article: JSON.parse(article),comments:JSON.parse(comresult),commentLength:JSON.parse(comresult).length});
    // res.send(article);
};


//向外共享方法
module.exports = {
    getHome,
    getArticle,

}