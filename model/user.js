// 用户相关代码
const mongoose = require('mongoose')
//集合规则
var guize = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 12
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    role: {
        type: String
    },
    // 状态，默认是0
    state: {
        type: Number,
        default: 0
    }
});

mongoose.set('useCreateIndex', true);
//创建文档的构造函数,前后两个单词规范的写法都是首字母大写
//mongoose的实现方式：当你根据如下的构造函数创建文档对象的时候，在数据库中的集合自动会有一个persons的集合
const User = mongoose.model('User', guize);

// User.create({
//     username: 'lisi1',
//     email: 'lisi1@qq.com',
//     password: '123456',
//     role: 'admin',
//     state: 0
// }, {
//     username: 'lisi2',
//     email: 'lisi2@qq.com',
//     password: '123456',
//     role: 'admin',
//     state: 0
// }, {
//     username: 'lisi3',
//     email: 'lisi3@qq.com',
//     password: '123456',
//     role: 'admin',
//     state: 0
// }, {
//     username: 'lisi4',
//     email: 'lisi4@qq.com',
//     password: '123456',
//     role: 'admin',
//     state: 0
// }, {
//     username: 'lisi5',
//     email: 'lisi5@qq.com',
//     password: '123456',
//     role: 'admin',
//     state: 0
// }, {
//     username: 'lisi6',
//     email: 'lisi6@qq.com',
//     password: '123456',
//     role: 'admin',
//     state: 0
// }, {
//     username: 'lisi7',
//     email: 'lisi7@qq.com',
//     password: '123456',
//     role: 'admin',
//     state: 0
// }, {
//     username: 'lisi8',
//     email: 'lisi8@qq.com',
//     password: '123456',
//     role: 'admin',
//     state: 0
// }).then(res => { console.log('创建用户成功') }).catch(err => console.log('创建用户失败'))

module.exports = {
    User
}