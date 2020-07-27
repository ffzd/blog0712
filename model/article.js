const mongoose = require("mongoose");
//集合规则
var guize = new mongoose.Schema({
    title: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    publishDate: {
        type: Date,
        default: Date.now()
    },
    cover: String,
    content: String
});

//创建文档的构造函数,前后两个单词规范的写法都是首字母大写
//mongoose的实现方式：当你根据如下的构造函数创建文档对象的时候，在数据库中的集合自动会有一个persons的集合
const Article = mongoose.model('Article', guize);
module.exports = {
    Article
}

