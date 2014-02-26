# Node-Server框架 #

## 框架和模块的安装 ##

1. 将库目录（lib/）下的所有内容拷贝到项目根目录。
2. 把`lib/config/package.json`拷贝到项目根目录。
3. 把所需的模块和钩子分别拷贝到modules和hooks目录。
4. 执行`npm install`，安装服务框架必备的NPM包。
5. 执行`node bin/create-package.js`，合并汇整各个模块的依赖项，并生成根目录下所需的package.json。
6. 再次执行`npm install`,安装所有模块所配置的NPM包。

## 框架的目录结构 ##

1. bin/		：系统内置命令的目录
2. config/	：系统样例配置的目录
3. hooks/	：存储模块自定义钩子的目录
4. lib/		：框架的类库
5. logs/	：系统日志的默认目录
6. modules/	：存储模块的目录

## 系统内置命令 ##

### bin/create-package.js ###

合并Node-Server框架及当前所有模块的npm依赖。

执行方法：`node bin/create-package.js`

### bin/install-modules.js ###

TODO：扫瞄和安装模块。

### bin/run-server.js ###

在命令行下启动服务。

执行方法：`node bin/run-server.js -m stub|dev|pro -c ../config/`

参数：

	-m, --mode	：服务启动的模式。支持桩（stub）、开发（dev）和产品（pro）三种启动模式。
	-c, --config：启动服务使用的配置文件目录。可以是以根目录为基准的相对目录，也可以是绝对路径。默认为../config/。

**配置文件以配置目录为基准，如下：**

1. 桩模式	：stub.json
2. 开发模式	：dev.json
3. 产品模式	：pro.json

## 系统的配置文件样例 ##

### NPM包依赖配置 ###

`config/package.json`：服务框架必备的NPM包依赖配置。

### Node-Server框架服务配置 ###

`config/stub.json`、`config/dev.json`、`config/pro.json`：服务应用的配置。

	{
	    "app": {
	        "http_port": "4444",
	        "vhost": "node-server",
	        "static_routes": [
	            { "path": "/config", "dir": "../config" }
	        ]
	    }
	}
1. app		：服务应用的配置节点。
2. http_port：HTTP协议下使用的端口号。
3. vhost	：虚拟HOST的配置。允许的值为字符串，或字符串的数组。如，`"vhost": "node-server"`，或`"vhost": ["node-server-1", "node-server-2"]`。
4. static_routes：用于配置静态文件的路由。允许值的类型为对象的数组。对象的属性`path`配置URL的绝对路径，`dir`配置静态文件的目录，可以是物理路径，也可以是相对于WEB应用根目录的相对目录。

## 钩子开发接口 ##

系统的钩子安装在hooks/目录中以钩子命令的目录中，如`hooks/start`。

### 当前支持的钩子列表 ###

1. start：服务在启动时调用的钩子，传递的数据为：{ 'mode': mode, 'config': config }

### 钩子模块的目录规范 ###

1. modules/{name}/lib					：模块的类库目录。
2. modules/{name}/package.json			：模块的NPM依赖配置。
3. hooks/{hook}/hook_{hook}_{name}.js	：钩子文件，要确保在框架中命名的唯一性。

**占位符**

1. {name}：模块的名称，要确保在在框架中命名的唯一性。
2. {hook}：钩子名称，如start。

### 钩子模块的示例代码 ###

	module.exports = function (data) {
	    data = data || {};
	    console.log(data);
	};

**data**参数为调用钩子时传递的数据。

## 模块开发接口 ##

### 标准目录规范 ###

1. modules/{name}/package.json	：模块的NPM依赖配置。执行`node bin/create-package.js`，可以扫瞄合合并模块的依赖。
2. modules/{name}/routes/		：系统路由定义。服务启动时，会自动扫瞄调用。
3. modules/{name}/middleware/	：系统中间件定义。服务启动时，会自动扫瞄调用。

**占位符**

1. {name}：模块的名称，要确保在在框架中命名的唯一性。

**路由示例**

	module.exports = function (app) {
	    app.get('/', function (req, res) {
	        var ok = { name: 'sample' };
	        return res.json(ok, 200);
	    });
	};

**中间件示例**

	module.exports = function (app) {
	    app.use(function (req, res, next) {
	        next();
	    });
	};

### 推荐目录规范 ###

1. modules/{name}/config		：模块的配置目录。
2. modules/{name}/lib			：模块的类库目录。其他模块设置依赖后，也可以直接引用其中的类库。
3. modules/{name}/lib/models	：模块的模型类。
4. modules/{name}/lib/helpers	：模块的帮助类。

## 模块的开发 ##

### 普通的开发模式 ###

遵循《钩子开发接口》和《模块开发接口》，就可以进行Node-Server框架的模块开发。

模块开发完毕后，可以按照《框架和模块的安装》步骤，将框架和模块组装在一起。

### 模块脚手架开发模式 ###

可以使用[yeoman工具(http://yeoman.io/)](http://yeoman.io/)搭建模块的脚手架。

全局安装yeoman工具：

	npm install yeoman -g

克隆脚手架的代码：

	git clone https://github.com/toolkit-rack/generator-server-module.git

进入脚手架目录：

	cd generator-server-module

建立NPM软链接：
	
	npm link

进入模块开发的空目录，按照提示执行：

	yo server-module

## TODO ##

1. 单元测试和持续集成(travis-ci)
2. 控制服务启动、停止和重启的脚本（windows版本和linux版本）