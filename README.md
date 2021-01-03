# Node 综合 Web 案例

## 创建目录结构

1. 规划项目中有哪些文件夹、文件，及其作用

   ```js
   app.js                 项目入口文件
   controllers
   models                 存储 mongoose 设计的模型
   node_modules           第三方包
   package.json           包描述文件
   package-lock.json      第三方包版本锁定文件
   public                 公共的静态资源
   README.md              项目说明文档
   routes                 如果业务较多，最好把路由分类存储到 routes 目录中；简单一点的业务可以一起写到 routes.js 中
   views                  存储视图目录
   ```

## 初始化项目结构

1. 初始化 package.json
2. git init
3. 装核心依赖
4. 基本目录
5. app.js 启动简单服务进行测试
6. 开放静态资源
7. 配置 art-template

## 整合静态页、模板页

1. 整理 views 文件夹

   1. _partials
      1. footer.html
      2. header.html
      3. setting-nav.html
   2. _layouts
      1. home.html
   3. settings
      1. admin.html
      2. profile.html
   4. topic:
      1. edit.html
      2. new.html
      3. show.html
   5. index.html
   6. login.html
   7. register.html

2. 模板语法：`art-template`、`express-art-template`
   1. include 引入子模板
   2. block 留坑、填坑
   3. extend 模板继承

   ```html
   <!-- home.html的部分 -->
   <body>
     {{include '../_partials/header.html'}}
     {{block 'body'}}{{/block}} <!--挖坑-->
     {{include '../_partials/footer.html'}}
     <script src="/node_modules/jquery/dist/jquery.js"></script>
     <script src="/node_modules/bootstrap/dist/js/bootstrap.js"></script>
     {{block 'script'}}{{/block}}
   </body>
   
   <!-- index.html的部分 -->
   {{extend './_layouts/home.html'}}
   {{block 'title'}}{{'多人博客 - 首页'}}{{/block}}
   {{block 'body'}} <!--填坑-->
   <section class="container">
     ... ...
   </section>
   <script src="/node_modules/jquery/dist/jquery.js"></script>
   <script>
     $('.pageCode').on('click', function (e) {
       e.preventDefault() // 阻止默认事件
       var formData = $(this).serialize();
       $(this).addClass('active').siblings('.active').removeClass('active');
       $.ajax({
         url: '/choosePage',
         type: 'get',
         data: `num=${$(this).children('a').html()}`,
         dataType: 'json',
         success: function (data) {
           var err_code = data.err_code
           if (err_code == 0) {
             $('.media-list').html('');
             for(let i = 0;i < data.topic.length;i ++) {
               let li = $(`<li class="media">
               <div class="media-left">
                 <a href="#">
                     <img width="40" height="40" class="media-object" src="../public/img/avatar-default.png" alt="...">
                   </a>
               </div>
               <div class="media-body">
                 <h4 class="media-heading"><a href="/topics/show?id=${data.topic[i]._id}">${data.topic[i].title}</a></h4>
                 <p>sueysok 回复了问题 • 2 人关注 • 1 个回复 • 187 次浏览 • 2017-10-20 13:45</p>
               </div>
             </li>`
             );
             $('.media-list').append(li);
             } 
           } else if (err_code == 500) {
             window.alert('服务器忙，请稍后再试');
           }
         }
       })
     })
   </script>
   {{/block}}
   ```

   

## 设计首页路由

### header

### body

1. 请求首页

2. 服务端查询 topic 数据，并响应

3. 分页显示功能

   1. 修改 router.get(‘/‘, function(req, res, next) {...})

      1. 告诉客户端一共多少页
      2. 响应第一页
      3. 监听页面点击事件，触发请求

   2. 配置 router.get(‘/choosePage’, function(req, res, next) {...})

      1. 接收请求页数
      2. 根据页数切分数据
      3. 响应数据

   3. 修改 index.html

      1. 页码点击事件

      2. 切换 active 类

         ```js
         $(this).addClass('active').siblings('.active').removeClass('active');
         ```

      3. 异步请求

      4. 局部更新数据

         1. 清空原有数据

            ```js
            $('.media-list').html('');
            ```

         2. 新增响应数据

            ```js
            let li = $(`<li class="media">...
            			<a href="/topics/show?id=${data.topic[i]._id}">${data.topic[i].title}</a>
            			...</li>`
            );
            $('.media-list').append(li);
            ```

### footer

## 设计用户登录、退出、注册的路由

| 路径      | 方法 | get 参数 | post 参数                 | 是否需要登录 | 备注         |
| --------- | ---- | -------- | ------------------------- | ------------ | ------------ |
| /         | GET  |          |                           |              | 渲染首页     |
| /register | GET  |          |                           |              | 渲染注册页面 |
| /register | POST |          | email、nickname、password |              | 处理注册请求 |
| /login    | GET  |          |                           |              | 渲染登陆页面 |
| /login    | POST |          | email、password           |              | 处理登陆请求 |
| /logout   | GET  |          |                           |              | 处理退出请求 |

### router.js

1. 导入 express 包
2. 声明路由容器
3. 写路由（get、post）
4. export 导出路由
5. app.js 中加载 router.js，并挂载路由

### 设计 User 数据库模型

### 用户注册

1. 先处理好客户端注册页面的内容（表单控件的 name、收集表单数据、发起请求）
2. 服务端
   1. 配置 body-parser，获取客户端表单请求数据
   2. 操作 MongoDB 数据库
      1. models 文件夹保存多个数据模型
      2. 设计 User 数据模型 user.js
      3. 连接数据库
   3. 处理注册请求 router.post(‘./register’, function(req, res) {...})
      1. 获取表单数据：req.body
      2. 操作数据库
         1. 判断用户是否已存在：User.findOne({}, function(err, data) {...})
         2. 如果用户已存在，不允许注册
            1. 客户端的异步请求指定服务端返回 json 类型数据（字符串格式）
            2. express 提供了一个 json 方法，自动把 json 对象转为字符串并返回
         3. 否则允许注册注册，并保存用户信息
            1. new User(req.body).save(function(err, user) {...})
      3. 发送响应
      4. 跳转首页（客户端完成，服务端重定向对异步请求无效）window.location.href = ‘/’
3. 注册成功后改变登录状态
   1. 安装配置 express-session
   2. 使用 session 记录用户的登录状态 req.session.user = user;
   3. 渲染首页时，传进 req.session.user
   4. 显示当前登录用户，隐藏登录、注册按钮
      1. {{ if user }} ... {{ else }}...{{ /if }}

### 用户登录 

1. 处理好客户端登录页面的内容
2. 获取表单数据：req.body
3. 查询数据库
   1. 用户名密码是否正确 User.findOne({}, function(err, user) {...})
4. 使用 session 记录用户的登录状态 req.session.user = user;
5. 发送响应数据

### 用户退出

1. 处理好客户端页面退出请求的内容
2. 处理退出路由
   1. 使用 session 记录用户的登录状态 req.session.user = null;
   2. 重定向到登录页 res.redirect(‘/login’)

## 设计发表文章路由

| 路径         | 方法 | get 参数 | post 参数                              | 是否需要登录 | 备注         |
| ------------ | ---- | -------- | -------------------------------------- | ------------ | ------------ |
| /topics/new  | GET  |          |                                        |              |              |
| /topics/new  | POST |          | req.body：userId、type、title、article |              | 渲染注册页面 |
| /topics/show | GET  | id       |                                        |              |              |

### 设计 topic 数据库模型

1. 导入 mongoose
2. 声明 Schema 变量，用于创建数据库模型
3. 连接数据库
4. 设计 topicSchema
5. 导出模型

### 处理发起新话题

1. 先处理创建新话题的页面
   1. header.html 点击发起按钮，进行 get 请求
   2. 服务器端路由接收 get 请求
      1. 渲染新建话题页面
      2. 同时需要将用户信息响应过去（不然无法请求页面？为什么呢）
   3. submit 按钮触发 post 请求
2. 服务端处理 post 请求
   1. 获取表单数据：req.body
   2. 操作数据库
      1. 保存 topic 信息
   3. 发送响应
   4. 跳转首页（客户端完成，服务端重定向对异步请求无效）window.location.href = ‘/’
   5. 处理首页的博客显示
      1. 使用模板语法，处理 index.html，方便显示 topic  数据
      2. 处理 router.get(‘/’, function(req, res) {...})
         1. 查询 topic 数据
         2. 分页显示（未完成）

### 处理显示博客详情

1. 点击首页的博客标题时，显示博客详情页

   ```html
   <a href="/topics/show?id={{$value.id}}">{{$value.title}}</a>
   ```

2. 服务端处理 get 请求

   1. 获取查询字符串`req.query`

   2. 获取文章id`req.query.id`

   3. 根据 id 查询博客数据，并响应数据

      ```js
      Topic.findOne({
              _id: req.query.id
          }, function(err, data) {
              if (err) {
                  return next(err)
              }
              console.log(data)
              res.render('topic/show.html', {
                  topic: data
              });
          });
      ```

   4. 根据响应数据，处理 show.html

      1. 模板语法

### 处理博客评论

1. 设计评论数据库模型
2. 点击显示博客详情页面的发表评论按钮时，发起评论请求
   1. form 提交
   2. 请求要包含需要的 comment 数据表字段   在处理这里
3. 处理请求路由
   1. 判断是否已登录
   2. 保存评论
   3. 客户端重定向
4. 处理删除请求路由
   1. 没有实现
   2. 逻辑不清晰：怎么保证是正确的用户在删除；不是正确的用户或者用户未登录时，是否可以显示删除按钮
   3. 服务端删除没有成功
   4. 不是正确的用户或者用户未登录时，是否可以显示删除按钮

### 处理设置用户

1. 登录状态下，可以点击设置按钮进入用户设置界面

   ```html
   <!-- header.html -->
   <li><a href="/settings/profile">设置</a></li>
   ```

2. 处理用户设置的 get 请求路由

   1. 渲染用户设置页面

   2. 配置模板引擎渲染用户设置页面的基本信息，性别需要特殊处理

   3. 给表单添加 name 属性

   4. 给 form 添加异步请求

      ```js
      $('#profile_form').on('submit', function(e) {...}
      ```

3. 处理用户设置的 post 请求路由

   1. 获取请求数据

   2. 更新数据

      ```js
      User.findByIdAndUpdate(req.session.user._id, req.body, function(err, ret) {...}
      ```

   3. 响应数据

      ```js
      res.status(200).json({
          err_code: 0,
          message: '更新成功'
      });
      ```

   4. 前端重定向，重定向前更新session的 user信息

## 实现记住我功能

