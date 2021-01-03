var express = require('express');
var User = require('./models/user');
var md5 = require('blueimp-md5');
const Topic = require('./models/topic');
const Comment = require('./models/comment');
const topic = require('./models/topic');

var router = express.Router();

router.get('/', function(req, res, next) {

    Topic.find(function(err, topic) {
        if (err) {
            return next(err)
        }

        var pageNum = Math.ceil(topic.length / 10);
        var pageNo = [];
        for (var i=1; i<=pageNum; i++) {
            pageNo.push(i);
        }
        

        res.render('index.html', {
            user: req.session.user,
            topic: topic.slice(0,10),
            pageNo: pageNo,
        });
    });
});

router.get('/choosePage',(req, res, next) => {
	Topic.find((err,topic) => {
		if(err) {
			return next(err);
		}
		
        let activePage = parseInt(req.query.num);
        let start = (activePage-1) * 10;
        let end = activePage * 10;
		
        let data = topic.slice(start,end);
		res.status(200).json({
            err_code: 0,
            message: '请求成功',
            topic: data
        });
	})
	
})

router.get('/login', function(req, res, next) {
    res.render('login.html');
});

router.post('/login', function(req, res, next) {
    // 1. 获取表单数据
    // 2. 查询数据库用户名与密码是否正确
    // 3. 发送响应数据
    var body = req.body;

    User.findOne({
        email: body.email,
        password: md5(md5(body.password))
    }, function(err, user) {
        if (err) {
            // return res.status(500).json({
            //     err_code: 500,
            //     message: '服务端错误'
            // });
            return next(err);
        }

        if (!user) {
            return res.status(200).json({
                err_code: 1,
                message: '邮箱或密码无效'
            });
        }

        // 用户存在，用 session 记录登录状态
        req.session.user = user;
        
        res.status(200).json({
            err_code: 0,
            message: '登录成功'
        });
    });
});

router.get('/register', function(req, res, next) {
    res.render('register.html');
});

router.post('/register', function(req, res, next) {
    // 1. 获取表单提交数据
    // 2. 操作数据库
    // 3. 发送响应
    var body = req.body;

    User.findOne({
        $or: [
            {email: body.email},
            {nickname: body.nickname}
        ]
    }, function(err, data) {
        if (err) {
            // return res.status(500).json({
            //     err_code: 500,
            //     message: '服务端错误'
            // });

            return next(err);
        }
        if (data) {
            return res.status(200).json({
                err_code: 1,
                message: '邮箱或昵称已经存在'
            });
        }

        body.password = md5(md5(body.password));
        new User(body).save(function(err, user) {
            if (err) {
                // return res.status(500).json({
                //     err_code: 500,
                //     message: '服务端错误'
                // });

                return next(err);
            }

            // 注册成功，使用 session 保存用户信息
            req.session.user = user;

            res.status(200).json({
                err_code: 0,
                message: '注册成功'
            });
        });
    });
});

router.get('/logout', function(req, res) {
    // 1. 清除登录信息
    // 2. 重定向到登录页面

    req.session.user = null;

    res.redirect('/login');
});

router.get('/topics/new', function(req, res) {
    res.render('topic/new.html',{user:req.session.user});
});

router.post('/topics/new',function(req,res) {
	var body = req.body;
	console.log(body);
	new Topic(body).save((err,data) => {
		if(err) {
			return res.end('Server Error');
		}
		res.redirect('/');
	})
});

router.get('/topics/show', function(req, res, next) {
    Topic.findOne({
        _id: req.query.id
    }, function(err, data) {
        if (err) {
            return next(err)
        }

        Comment.find({
            topicId: data._id
        }, function(err, comment) {
            if (err) {
                return next(err)
            }

            // console.log(comment)
            res.render('topic/show.html', {
                topic: data,
                comment: comment,
                user:req.session.user
            });
        });
    });
});

router.post('/topics/comment', function(req, res, next) {
    var comment = req.body;
    if (!req.session.user) {
        return res.status(200).json({
            err_code: 1,
            message: '用户未登录'
        });
    } else {
        comment.commenterId = req.session.user._id;
        comment.commenterName = req.session.user.nickname;

        comment.topicId = comment.topicId.replace("\"","").replace("\"","");

        new Comment(comment).save(function(err, data) {
            if (err) {
                return next(err);
            }   

            res.status(200).json({
                err_code: 0,
                message: '评论成功'
            });
        });
    }
});

router.get('/settings/profile', function(req, res) {
    res.render('settings/profile.html', {
        user:req.session.user
    });
});

router.post('/settings/profile', function(req, res) {
    User.findByIdAndUpdate(req.session.user._id, req.body, {new: true}, function(err, ret) {
        if (err) {
            return res.status(500).json({
                err_code: 500,
                message: '查找失败'
            });
        } else {
            req.session.user = ret
            res.status(200).json({
                err_code: 0,
                message: '更新成功'
            });
        }
    });
});


module.exports = router;