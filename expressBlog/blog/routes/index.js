var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var user = require('../models/user.js');
var Post  = require('../models/post.js');
var Comment = require('../models/comment.js');
function checkLogin(req,res,next){

	if(!req.session.user){
		req.flash('error','你还没有登录');
		return res.redirect('/login');
	}
	next();
};
function checkNotLogin(req,res,next){

	if(req.session.user){
		req.flash('error','您已经登录');
		return res.redirect('back');
	}
	next();
}

/* GET home page. */
router.get('/', function (req, res) {
  //判断是否是第一页，并把请求的页数转换成 number 类型
  var page = req.query.p ? parseInt(req.query.p) : 1;
  Post.getAll(null,page, function (err, posts,total) {
    if (err) {
      posts = [];
    } 
    res.render('index', {
      title: '主页',
      user: req.session.user,
      posts: posts,
      page: page,
      isFirstPage: (page - 1) == 0,
      isLastPage: ((page - 1) * 10 + posts.length) == total,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

router.get('/reg',checkNotLogin);
router.get('/reg', function (req, res) {
	res.render('reg', { 
		user: req.session.user, 
		title: '注册', 
		success: req.flash('success').toString(),
      	error: req.flash('error').toString() 
    });
});

router.get('/login',checkNotLogin);
router.get('/login', function(req, res) {

    res.render('login', {
        user: req.session.user,
        title: '登录',
        user: req.session.user,
        warn: req.flash('warning').toString(),
        success: req.flash('success').toString(),
        error: req.flash('err').toString()
    });
});

router.post('./login',checkNotLogin);
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

router.get('/post', checkLogin);
router.get('/post', function (req, res) {
    res.render('post', {
      title: '发表',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
});

router.post('/post', checkLogin);
router.post('/post', function (req, res) {
	var currentUser = req.session.user,
	post = new Post(currentUser.name, req.body.title, req.body.post);
	post.save(function (err) {
		if (err) {
		  req.flash('error', err); 
		  return res.redirect('/');
		}
		req.flash('success', '发布成功!');
		res.redirect('/');//发表成功跳转到主页
	});
});

router.get('/logout', checkLogin);
router.get('/logout', function (req, res) {
	req.session.user = null;
	req.flash('success', '登出成功!');
	res.redirect('/');
});

router.post('/reg',checkNotLogin);
router.post('/reg',function(req,res){
	var name = req.body.name;
	var password = req.body.password;
	var password_re = req.body['password-repeat'];
	if(password_re != password) {
		req.flash('err','两次输入的密码不对');
		return res.redirect('./reg');
	}

	//md5加密
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('hex');
	var newUser = new user({
		name:name,
		password:password,
		email: req.body.email
	})
	//检查用户名是否存在
	user.get(newUser.name,function(err,user){
		if(err){
			req.flash('err',err);
			return res.redirect('/login');
		}
		if(user){
			req.flash('err','用户名已经存在');
			return res.redirect('./reg');
		}
		//用户名不存在，插到数据库
		newUser.save(function(err,user){
			if(err){
				req.flash('err'.err);
				return res.redirect('/reg');
			}
			req.session.user = user;
			req.flash('success','注册成功');
			return res.redirect('/');
		})
	})
})

router.get('/upload',checkLogin);
router.get('/upload',function(req,res){
	res.render('upload',{
		title:'文件上传',
		user:req.session.user,
		success:req.flash('success').toString(),
		error:req.flash('error').toString()
	})
})

router.post('/upload',checkLogin);
router.post('/upload',function(req,res){

	req.flash('success','上传成功');
	res.redirect('/');
})
router.get('/u/:name',function(req,res){
	user.get(req.params.name,function(err,user){
		if(!user){
			req.flash('error','用户不存在');
			return res.redirect('/');
		}
		Post.getAll(user.name,function(err,posts){
			if(err){
				req.flash('err'.err);
				return res.redirect('/');
			}
			res.render('user',{
				title: user.name,
				posts:posts,
				user: req.session.user,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			})
		})
	})
})

router.get('/u/:name/:day/:title',function(req,res){
	Post.getOne(req.params.name, req.params.day, req.params.title,function(err,post){
		if(err){
			req.flash('error','err');
			
			return res.redirect('/');
		}

		res.render('article',{
			title: req.params.title,
			posts: post,
			user: req.session.user,
			success: req.flash('success').toString(),
      		error: req.flash('error').toString()
		})
	})
})

router.post('/u/:name/:day/:title', function (req, res) {
  var date = new Date(),
      time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
             date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
  var comment = {
      name: req.body.name,
      email: req.body.email,
      website: req.body.website,
      time: time,
      content: req.body.content
  };
  var newComment = new Comment(req.params.name, req.params.day, req.params.title, comment);
  newComment.save(function (err) {
    if (err) {
      req.flash('error', err); 
      return res.redirect('back');
    }
    req.flash('success', '留言成功!');
    res.redirect('back');
  });
});


router.get('/edit/:name/:day/:title', checkLogin);

router.get('/edit/:name/:day/:title', function (req, res) {
  var currentUser = req.session.user;
  Post.edit(currentUser.name, req.params.day, req.params.title, function (err, post) {
    if (err) {
    	console.log(err)
      req.flash('error', err); 
      return res.redirect('back');
    }
    res.render('edit', {
      title: '编辑',
      post: post,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});

router.post('/edit/:name/:day/:title', checkLogin);
router.post('/edit/:name/:day/:title', function (req, res) {
  var currentUser = req.session.user;
  Post.update(currentUser.name, req.params.day, req.params.title, req.body.post, function (err) {
    var url = encodeURI('/u/' + req.params.name + '/' + req.params.day + '/' + req.params.title);
    if (err) {
      req.flash('error', err); 
      return res.redirect(url);//出错！返回文章页
    }
    req.flash('success', '修改成功!');
    res.redirect(url);//成功！返回文章页
  });
});


router.get('/remove/:name/:day/:title', checkLogin);
router.get('/remove/:name/:day/:title', function (req, res) {
  var currentUser = req.session.user;
  Post.remove(currentUser.name, req.params.day, req.params.title, function (err) {
    if (err) {
      req.flash('error', err); 
      return res.redirect('/');
    }
    req.flash('success', '删除成功!');
    res.redirect('/');
  });
});
module.exports = router;

