//用户数据相关的代码
const mongoose = require('mongoose')
//集合规则
var guize = new mongoose.Schema({
    //用户名
    username:{
        type:String,
        required:true,
        minlength:2,
        maxlength:12 
    },
    //邮箱
    email:{
        type:String,
        unique:true
    },
    //密码
    password:{
        type:String 
    },
    //角色 普通管理员 normal 超管 admin
    role:{
        type:String 
    },
    //state 默认是0 启用 1禁用
    state:{
        type:Number,
        default:0 
    }
});

//创建文档的构造函数,前后两个单词规范的写法都是首字母大写
//mongoose的实现方式：当你根据如下的构造函数创建文档对象的时候，在数据库中的集合自动会有一个persons的集合
const User = mongoose.model('User',guize);

// module.exports.User = User 

// User.create({
//     username