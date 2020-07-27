const { User } = require('../../model/user');
const bcrypt = require('bcrypt');

module.exports = async (req, res, next) => {
	// 接收客户端传递过来的请求参数
	const { password } = req.body
	// 获取要修改的用户id
	const {id} = req.query;
	// 查询用户信息
	let user = await User.findOne({_id: id});
	// 密码比对
	let isEqual = await bcrypt.compare(password, user.password);
	// 如果密码比对成功
	if (isEqual) {

	}else{
		// 密码比对失败
		next(JSON.stringify({path: `/admin/user-edit?id=${id}`, message: 'sdfsf'}))
	}
}