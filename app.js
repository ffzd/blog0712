const express = require('express')
const app = express()
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')))
require('./model/connect')
// require('./model/user')
//告诉express框架模板所在的位置
app.set('views', path.join(__dirname, 'views'));
//告诉express框架模板的默认后缀是什么
app.set('view engine', 'art');
//当渲染后缀为art的模板时，所使用的模板引擎是什么
app.engine('art', require('express-art-template'));

const bodyParser = require('body-parser')
// 处理post请求参数
app.use(bodyParser.urlencoded({ extended: false }))
const session = require('express-session')
app.use(session({
    secret: '431eqwdwdqweqwe',
    saveUninitialized: false,//每个用户来超市就会给分配一个柜子session,因此要改为true
    // 默认浏览器关闭的时候cookie就会失效
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}))
// 直接假设它就是登陆状态 为了开发辅助，在项目完成之后要删除掉这一条
// app.use(async (req, res, next) => {
//     const { User } = require('./model/user')
//     let user = await User.findOne({ email: 'zs@qq.com' })
//     req.session.username = user.username
//     // console.log(req.session)
//     req.app.locals.userInfo = user
//     next()
// })

//通用中间件 强制清除浏览器缓存 后退的缓存bug
app.use((req, res, next) => {
    res.header("Cache-Control", "no-cache, no-store,must-revalidate")
    res.header("Expires", "0")
    res.header("Pragma", "no-cache")
    next()

})
app.use('/admin', (req, res, next) => {
    // 如果不是去买票并且手里没票就强制让他跳转到登陆路由
    // if (req.url != '/login' && !req.session.username) {
    //     res.redirect('/admin/login')

    // } else {

    //     if (req.session.role == 'normal') {
    //         if (req.url != '/login' || req.url != '/logout') {
    //             res.redirect('/home/')
    //             return;
    //         }
    //     }
    //     next()
    // }
    if (req.url == '/login' || req.url == '/logout') {
        next()
    } else {
        if (req.session.role != 'admin') {
            res.redirect('/home/')
        } else {
            next()
        }
    }
})
app.use('/admin', (req, res, next) => {
    req.app.locals.path = req.url
    next()
})
const template = require('art-template')
const dateformat = require('dateformat')
template.defaults.imports.dateformat = dateformat
// home,admin都是路由对象，路由代码应该写在最下面
const home = require('./route/home')
const admin = require('./route/admin')
app.use('/home', home)
app.use('/admin', admin)
app.listen(80)
console.log('服务器开启成功')




//
//      ┏┛ ┻━━━━━┛ ┻┓
//      ┃　　　　　　 ┃
//      ┃　　　━　　　┃
//      ┃　┳┛　  ┗┳　┃
//      ┃　　　　　　 ┃
//      ┃　　　┻　　　┃
//      ┃　　　　　　 ┃
//      ┗━┓　　　┏━━━┛
//        ┃　　　┃   神兽保佑
//        ┃　　　┃   代码无BUG！
//        ┃　　　┗━━━━━━━━━┓
//        ┃　　　　　　　    ┣┓
//        ┃　　　　         ┏┛
//        ┗━┓ ┓ ┏━━━┳ ┓ ┏━┛
//          ┃ ┫ ┫   ┃ ┫ ┫
//          ┗━┻━┛   ┗━┻━┛