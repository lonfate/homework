### 服务端及Nuxt

##### 1、为什么客户端首屏渲染慢？
网络条件不好，或者加载的资源太多时，会延长网页加载时间
##### 2、客户端不利于SEO优化

##### 3、同构渲染
服务端与客户端结合渲染，主要解决解决SEO及首屏速度慢的问题

##### 4、第三方解决方案
- react  Next.js
- vue   Nuxt.js

##### 5、开发条件有限
- 浏览器特定的代码，只能在某些特殊的生命周期使用
- 一些外部库，需要做特殊处理才能在服务端渲染应用中运行
- 不能在服务端渲染期间，操作DOM
- 某些代码需要区分运行环境

##### 6、同构应用只能部署在node.js Server中

##### Nuxt相关：
##### 1、nuxtServerInit
服务端特有的action方法，会在服务端渲染时，自动调用。
##### 2、同构渲染，登录信息的存储
在登录或注册时，将数据保存在Cookie中，然后在action中调用独特的nuxtServerInit，将数据写入Vuex。这样一来，每次刷新页面的时候，都会触发nuxtServerInit。保证了服务端渲染也能获取到登录信息。
##### 3、验证是否需登录，双端都需要做。
利用中间件去保护需要验证的页面
##### 4、怎样监听地址栏的query参数
需要使用watchQuery:['page']
##### 5、怎样处理TOKEN
- 使用axios拦截器做统一的设置
- 通过插件来获取上下文对象，而不是直接引入某个对象
##### 6、设置meta优化SEO
通过head设置当前的页面头部信息
##### 7、命令参数

服务器上需要安装nvm，通过nvm安装node，pm2，nuxt

ssh root@59...

scp .\realworld.zip root@59...:/root/nuxt-realworld

下载NVM：

wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

PM2启动：

pm2 start npm -- start

pm2 start pm2.config.json