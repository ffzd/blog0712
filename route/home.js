const express = require('express');
const { Article } = require('../model/article');
const home = express.Router()
// 前台首页
home.get('/', async (req, res) => {
    const page = req.query.page || 1;
    const size = 4;
    const count = await Article.countDocuments()
    const total = Math.ceil(count / size);
    const articles = await Article.find().skip((page - 1) * size).limit(size).populate('author');
    // console.log(articles)
    res.render('home/default', { articles, page, total })
})
// 前台详情页
home.get('/article', async (req, res) => {
    const { id } = req.query;
    const article = await Article.findOne({ _id: id }).populate('author')
    // 查询和当前文章所属的评论数据
    const comments = await Comment.find({ aid: id }).populate('uid')
    console.log(comments)
    res.render('home/article', { article, comments })
})
const { Comment } = require('../model/comment')
home.post('/comment', async (req, res) => {
    req.body.publishDate = Date.now()
    await Comment.create(req.body)
    // 重定向时携带文章的id值
    res.redirect('/home/article?id=' + req.body.aid)

})
module.exports = home