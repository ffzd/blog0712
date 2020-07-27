//连接mongodb数据库
const mongoose = require("mongoose");
//集合规则
var guize = new mongoose.Schema({
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    aid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    },
    // 评论内容
    content: String,
    publishDate: Date
});

//创建文档的构造函数,前后两个单词规范的写法都是首字母大写
//mongoose的实现方式：当你根据如下的构造函数创建文档对象的时候，在数据库中的集合自动会有一个persons的集合
const Comment = mongoose.model('Comment', guize);
module.exports = {
    Comment
}
