var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var user = require('../models/user.js');

console.log('aaa',12312312312312321312312321)
/* GET home page. */
router.get('/login', function (req, res) {
	res.render('login', { 
		user: req.session.user,
	  	title: '登录',
	  	user: req.session.user,
	  	warn:req.flash('warning').toString(),
	  	success: req.flash('success').toString(),
	  	error: req.flash('err').toString() 
	});
});

router.post('/login', function (req, res) {
	//md5
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('hex');
	user.get(req.body.name,function(err,user){
		if(!user){
			req.flash('err','用户不存在');
			req.flash('warning','先注册');
			return res.redirect('./login');
		}
		if(user.password != password){
			req.flash('err','密码错误');
			return res.redirect('./login');
		}
		req.session.user = user;
		req.flash('success','登录成功');
		return res.redirect('/');
	})
});

module.exports = router;

