//文章集合
const mongoose = require('mongoose');//导入mongoose模块

//创建集合规则
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 4,
        maxlength:50,
        required: [true, '请填写文章标题'],
        trim:true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',  //关联用户集合
        required:[true,'请传递作者'],
    },
    publishDate: {
        type: Date,
        default: Date.now,
    },
    //封面
    cover: {
        type: String,
        default:null,
    },
    content: {
        type: String,
    },
});

//创建文章集合
const Article = mongoose.model('Article', articleSchema);



//向外共享文章集合对象
module.exports = {
    Article,
}