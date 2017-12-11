# Sakura-cli

### Why

[[配合sakura]](之后会有连接)服务器的命令行工具，也可以自己实现服务，用于解决h5的开发与发布的流程。h5的开发我们期望的是快速搭建一个可以编写代码的环境，而h5的发布，现在我们越来越多的会倾向于只发布js，针对js的发布，我们希望做到快速并进行版本控制，sakura期望并尝试完成这个功能


### TODO

- [x] 命令行入口及配置
- [x] webpack-dev-server 2.0 模板
- [ ] 添加测试模块
- [ ] 添加mock模块
- [ ] 命令行登录
- [x] 添加normal配置
- [x] 添加react配置
- [x] 添加proxy命令，用于启动一个简易代理服务器，解决sessionId的问题
- [ ] 静态资源上传模块
- [ ] 根据配置的发布
- [ ] 添加vue的配置和模板

### install

```bash
npm install -g sakura-cli
```

### usage

新建项目:

```bash
cd /path/to/project/parent
sakura-cli create <projectname>
```

在项目中添加配置文件:

```bash
cd /path/to/project
sakura-cli init
```

简易代理服务器：

```bash
PORT=4000 sakura-cli proxy
```

### sakura.config.json

###### defaultResources: { javascripts: [], styles: [] }

默认导入的资源, 不关注sakura.resources.json，无论如何都会被使用

###### single

是否为单页应用

###### entry

入口文件，项目的webpack文件默认会从这个对象中读取打包入口文件

###### appid

在远程服务器注册的appid

###### sakuraServer

自定义的远程应用服务器地址

###### config

`proxyHost`: 转发请求的远程地址

`dingding`: 关于是否需要钉钉免登的配置

`wechat`: 关于是否需要微信的配置

`auth`: 用于处理关于请求的一些auth信息(解决关于转发请求需要sessionId之类的认证信息的问题)(`key`: 认证信息的字段名, `path`: 认证信息的登录path，`valuePath`: 认证登录后的data去到认证信息的路径)
