const joi = require('joi')

const schema = {
    username: joi.string().min(2).max(15).required().error(new Error('用户名写错了'))
}
async function fn() {
    try {
        await joi.validate({ username: 'z' }, schema)
        console.log('验证通过')
    } catch (err) {
        console.log(err.message)
    }
}
fn()