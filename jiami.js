const bcrypt = require('bcryptjs')
async function fn() {
    let salt = await bcrypt.genSalt(10)
    console.log(salt)
    var pwd = await bcrypt.hash('123456', salt)
    console.log(pwd)
}
fn()