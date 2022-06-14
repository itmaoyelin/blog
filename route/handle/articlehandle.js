const { Article } = require('../../model/article');//引入文章集合
const formidable = require('formidable'); //引入formidable模块
const path = require('path');//导入path模块
const pagination = require('mongoose-sex-page');//导入第三方模块 分页方法


//获取文章列表处理函数
const getArticle = async (req, res) => {
     //接收客户端传递过来的页码
     const page = req.query.page;
     //标识 当前访问的使用管理页面
    req.app.locals.currentLink = 'article';
    //page指定当前页，size指定每页显示的数据条数 ，display指定客户端要显示的页码数量
    //exec向数据库中发送查询请求
    let articles = await pagination(Article).find().page(page).size(3).display(3).populate('author').exec(); //多集合联合查询
    let articleInfo = JSON.stringify(articles); //先转换为JSON字符串
    // res.send(articles);

    //渲染文章列表页面
    res.render('admin/article', { articles:JSON.parse(articleInfo) });//再转换回普通JSON对象
};

//获取文章编辑页面处理函数
const getArticleEdit = async(req, res) => {
    //标识 当前访问的使用管理页面
    req.app.locals.currentLink = 'article';
    
    const article = await Article.findOne({ _id: req.query.id });
    res.render('admin/article-edit', {
        article: article,
        link1: '/admin/article-add', link2: '/admin/article-update?id=' + req.query.id,
    });
};

//添加文章处理函数
const postArticleAdd = (req, res) => {
    //创建表单解析对象
    const form = new formidable.IncomingForm();
    // console.log(form);
    //配置文件上传存放位置
    form.uploadDir = path.join(__dirname, '../', '../', 'public', 'uploads');
    //保留上传文件的后缀名
    form.options.keepExtensions = true;
    // console.log(form);
    //解析表单对象
    form.parse(req, async (err, fields, files) => {
        //err错误对象，表单解析失败，err存储错误信息，表单解析成功，err为null;
        //fields 对象类型，保存普通表单数据
        //files 对象类型，保存了和上传文件相关的数据
        //res.send(files);
        //res.send(files.cover.filepath.split('public')[1]); //分割图片路径
        await Article.create({
            title: fields.title,
            author: fields.author,
            publishDate: fields.publishDate,
            cover: files.cover.filepath.split('public')[1],
            content: fields.content,
        }).then(result => {
            //将页面重定向到文章列表页面
            res.redirect('/admin/article');
        }).catch(err=> {
            res.redirect('/admin/article-edit');
        })
        
    });
};

//文章修改处理函数
const postArticleUpdate = (req, res) => {

    // 解析对象
    const form = new formidable.IncomingForm();
    // console.log(form);
    //配置文件上传存放位置
    form.uploadDir = path.join(__dirname, '../', '../', 'public', 'uploads');
    //保留上传文件的后缀名
    form.options.keepExtensions = true;
    // console.log(form);
    //解析表单对象
    form.parse(req, async (err, fields, files) => {
        //err错误对象，表单解析失败，err存储错误信息，表单解析成功，err为null;
        //fields 对象类型，保存普通表单数据
        //files 对象类型，保存了和上传文件相关的数据
        //res.send(files);
        //res.send(files.cover.filepath.split('public')[1]); //分割图片路径
        await Article.updateOne({ _id: req.query.id }, {
            title: fields.title,
            author: fields.author,
            publishDate: fields.publishDate,
            cover: files.cover.filepath.split('public')[1],
            content: fields.content,
        });
        //将页面重定向到文章列表页面
        res.redirect('/admin/article');
    });  //创建表单
};

//文章删除处理函数
const getArticleDelete = async(req,res)=>{
    // res.send('OK');
    await Article.deleteOne({ _id: req.query.id });
    res.redirect('/admin/article');
}

//向外共享处理函数方法
module.exports = {
    getArticle,
    getArticleEdit,
    postArticleAdd,
    postArticleUpdate,
    getArticleDelete,
}