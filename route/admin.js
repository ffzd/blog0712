const express = require('express')
const admin = express.Router()
const { User } = require('../model/user')
const bcrypt = require('bcryptjs')
const joi = require('joi')
const formidable = require('formidable')
const path = require('path')
const { Article } = require('../model/article')
// admin.get('/', (req, res) => {
//     res.send('欢迎访问后台首页')
// })
// 登录路由
admin.get('/login', (req, res) => {
    res.render('admin/login')
})

admin.post('/login', async (req, res) => {
    // console.log(req.body)
    var { email, password } = req.body
    // console.log(req.body)
    if (email.trim() == "" || password.trim() == "") {
        res.status(400).render('admin/error', { tip: '邮箱或密码不能为空' })
        return;
    }
    var user = await User.findOne({ email })
    if (user == null) {
        res.status(400).render('admin/error', { tip: '邮箱或密码输错了' })
    } else {
        var bool = await bcrypt.compare(password, user.password)
        if (bool) {
            // 在登录成功重定向之前 在当前用户柜子里面放了用户的名字
            req.session.username = user.username
            // console.log(req.session)
            // 将用户角色存储在session对象中
            req.session.role = user.role;

            req.app.locals.userInfo = user
            // console.log(req.app.locals.userInfo)
            if (user.role == 'admin') {
                res.redirect('/admin/user')
            } else {
                res.redirect('/home')
            }
            res.redirect('/admin/user')//重定向
        } else {
            res.status(400).render('admin/error', { tip: '邮箱或密码输错了' })
        }
    }
})
//用户中心
admin.get('/user', async (req, res) => {
    var page = req.query.page || 1
    // var page = 1
    var size = 3
    var start = (page - 1) * size
    const users = await User.find().skip(start).limit(size)
    //数据总条数
    var count = await User.countDocuments()//总条数
    var total = Math.ceil(count / size)//总页数
    // console.log(users)
    res.render('admin/user', { users, total, page })
})
// admin.get('/user', async (req, res) => {
//     let users = await User.find({})
//     console.log(users)
//     res.render('admin/user', {
//         // msg: req.session.username
//         users
//     });
// })
//新增用户
admin.get('/user-add', (req, res) => {
    const { message } = req.query
    res.render('admin/user-add', { message });
})
// 处理新增表单数据
admin.post('/user-add', async (req, res) => {
    // 验证规则
    const schema = {
        username: joi.string().min(2).max(12).required().error(new Error('用户名不符合规则')),
        email: joi.string().email().required().error(new Error('邮箱不符合规范')),
        password: joi.string().regex(/^[a-zA-Z0-9]{6,18}$/).error(new Error('密码不符合规则')),
        role: joi.string().valid('normal', 'admin').error(new Error('角色不符合规则')),
        state: joi.number().valid(0, 1).error(new Error('状态不符合规则'))
    }
    // console.log(req.body)
    // res.send('ok')
    try {
        await joi.validate(req.body, schema)
        // res.send('验证通过')
        // 先判断邮箱是否重复，若重复报错，若没有重复就添加到数据库中
        var user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.redirect('/admin/user-add?message=邮箱不能重复')
        }
        // 添加到数据库中 用户输入的密码是明文 但是数据库中要存密文
        const salt = await bcrypt.genSalt(10)
        req.body.password = await bcrypt.hash(req.body.password, salt)//加密密码
        await User.create(req.body)//添加到数据库中
        res.redirect('/admin/user')
    } catch (err) {
        // 在重定向时还要把错误信息携带过去
        res.redirect(`/admin/user-add?message=${err.message}`)
    }

})
//用户编辑
admin.get('/user-edit', async (req, res) => {
    const { id, msg } = req.query
    const user = await User.findOne({ _id: id })
    // console.log(user)
    res.render('admin/user-edit', { user, msg });
})
//文章列表
admin.get('/article', async (req, res) => {
    const page = req.query.page || 1;
    const size = 2;
    const count = await Article.countDocuments()
    var start = (page - 1) * size
    var total = Math.ceil(count / size)//总页数
    const articles = await Article.find().skip(start).limit(size).populate('author')
    // console.log(articles)
    res.render('admin/article', { articles, page, total })
});
//文章增加
admin.get('/article-add', (req, res) => {
    res.render('admin/article-add');
})
//文章编辑
admin.get('/article-edit', (req, res) => {
    res.render('admin/article-edit');
});
//接收和处理用户编辑的数据
admin.post('/user-edit', async (req, res) => {
    //    先根据id值查询当前用户所有的数据
    const user = await User.findOne({ _id: req.body._id })
    var bool = await bcrypt.compare(req.body.password, user.password)
    if (bool) {
        // res.send('验证通过')
        var obj = req.body
        delete obj.password
        await User.updateOne({ _id: obj._id }, obj)
        res.redirect('/admin/user')
    } else {
        res.redirect(`/admin/user-edit?id=${req.body._id}&msg=密码写错了`)
    }

})
// 实现退出功能
admin.get('/logout', (req, res) => {
    // 删除session
    req.session.destroy(function () {
        // 删除cookies
        res.clearCookie('connect.sid')
        // 清空用户的数据信息
        req.app.locals.userInfo = null
        res.redirect('/admin/login')
    })


})
//删除用户
admin.get('/user-delete', async (req, res) => {
    const { id } = req.query
    await User.findOneAndDelete({ _id: id })
    res.redirect('/admin/user')
})
//接收和处理添加文章表单
// 在admin.js最开头 添加 const formidable
// 必须在public目录中自己手动创建uploads目录（node.js没有创建目录的权限）
admin.post('/article-add', (req, res) => {
    const form = formidable({ multiples: true })
    form.keepExtensions = true;
    form.uploadDir = path.join(__dirname, '../public/uploads')
    // fields:可以得到纯文本相关的一些表单数据
    // files：可以得到二进制的数据 图片、视频 
    form.parse(req, async (err, fields, files) => {
        console.log(fields)
        console.log(files)
        var obj = {
            title: fields.title,
            author: fields.author,
            publishDate: fields.publishDate,
            cover: files.cover.name,
            content: fields.content
        }
        // console.log(obj)
        await Article.create(obj)
        res.redirect('/admin/article')
    })
    // res.send('ok')
})
module.exports = admin