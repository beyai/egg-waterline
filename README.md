# egg-waterline

[![NPM version][npm-image]][npm-url]


[npm-image]: https://img.shields.io/npm/v/egg-waterline.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-waterline


<!--
Description here.
-->

## 安装

```bash
$ npm i egg-waterline --save
$ npm i sails-mysql --save
```

## 使用插件

```js
// {app_root}/config/plugin.js
exports.waterline = {
    enable: true,
    package: 'egg-waterline',
};
```

## 配置插件

```js
// {app_root}/config/config.default.js
exports.waterline = {
    app : true,
    agent : false,
    mount: 'model', // 模型目录
    migrate: "safe", 	// 数据迁移 safe|drop|alter
    defaults: { //模型默认设置
        primaryKey: 'id',
        attributes: {
            id: { 
            type: 'number', 
                autoMigrations: { 
                    autoIncrement: true,
                    columnType: "_numberkey"
                } 
            }
        }
    },
    db: { // 数据库配置
        default: { //数据库名称
            adapter: 'sails-mysql', // 数据库适配器，
            host: 'localhost',
            database: 'test',
            user: "root",
            password: "123456"
        }
    }
};
```
see [config/config.default.js](config/config.default.js) for more detail.

## 文档 API

详细文档请查看 [https://sailsjs.com/documentation/concepts/models-and-orm](https://sailsjs.com/documentation/concepts/models-and-orm)

## Example

##### 数据模型
> 0.2.0 支持子目录模型文件
> 访问规则: app.模型目录.文件名[自定义别名|子目录.文件名[自定义别名]]
> 除 模型目录 外其它别名首字母为大写

```js
// {app_root}/app/model/User.js
module.exports = app => {
    return {
        identity : "User", //model 自定义别名，app.model.User，未定义为文件名
        tableName : "user_table", //表名
        datastore : "default", //使用的数据库名称，默认为default
        schema : true,
        primaryKey: 'id',
        attributes : {
            id: { 
                type: 'number', 
                autoMigrations: { 
                    autoIncrement: true,
                    columnType: "_numberkey"
                } 
            },
            name : {
                type : "string",
                required: true
            }
        }
    }
}
```

##### 使用数据模型
```js
// {app_root}/app/controller/Home.js
module.exports = app => {
    class HomeController extends app.Controller {
        async index ( ctx ) {
            let res = await app.model.User.find({
                id : 1
            });
            ctx.body = res;
        }
    }
    return HomeController;
}
```

## 更新日志
##### 0.2.0
1. 支持子目录模型文件
2. 开发模式下根据模型自动创建表结构
3. 增加模型默认配置
4. waterline升级到0.13.6
5. 支持更多的数据库适配器，需手动安装sails支持的适配器


