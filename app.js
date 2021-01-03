var express = require('express');
var path = require('path');
var router = require('./router');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();

// 开放静态资源
app.use('/public/', express.static(path.join(__dirname, './public/')));
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')));

// 配置 art-template
app.engine('html', require('express-art-template'));

// .html 自动查找位置
app.set('views', path.join(__dirname, './views')); // 默认是 ./views 目录

// 配置 POST 请求体插件 body-parser，一定要在挂载路由之前
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// 配置 express-session
app.use(session({
    secret: 'keyboard cat', // 配置加密字符串，它会在原有加密基础之上和这个字符串拼起来加密
    resave: false,
    saveUninitialized: true // 取值为 true 时，无论是否使用 session，都使默认分配一把钥匙
}));

// 把路由挂载到 app 中
app.use(router);

// 配置一个处理 404 中间件
app.use(function(req, res) {
    res.end('<h1>404</h1>');
});

// 配置一个全局错误处理中间件
app.use(function(err, req, res, next) {
    res.status(500).json({
        err_code: 500,
        message: err.message
    });
});

app.listen(3000, function() {
    console.log('running ...');
});