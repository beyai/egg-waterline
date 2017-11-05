# egg-waterline

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-waterline.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-waterline
[travis-image]: https://img.shields.io/travis/eggjs/egg-waterline.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-waterline
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-waterline.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-waterline?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-waterline.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-waterline
[snyk-image]: https://snyk.io/test/npm/egg-waterline/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-waterline
[download-image]: https://img.shields.io/npm/dm/egg-waterline.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-waterline

<!--
Description here.
-->

## Install

```bash
$ npm i egg-waterline --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.waterline = {
  enable: true,
  package: 'egg-waterline',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.waterline = {
	mount: 'model', // 模型目录
	db: { // 数据库配置，内部支持 mongodb , mysql
		default: { //数据库名称
    		adapter: 'mongodb', // 数据库 mongodb | mysql
    		host: 'localhost',
    		port: 27017,
		    database: 'test',
		}
	},
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## 文档 API

详细文档请查看 https://sailsjs.com/documentation/concepts/models-and-orm

## Example

##### 数据模型

```js
// {app_root}/app/model/User.js
module.exports = app => {
    return {
        identity : "User", //model访问名称，app.model.User，未定义为数据表名
        tableName : "user_table", //表名
        connection : "default", //使用的数据库名称
        schema : true,
        attributes : {
            id : {
                type : "objectid",
                primaryKey: true
            },
            name : {
                type : "string",
                required: true
            }
        },
        beforeCreate : function ( values , next ){
            next();
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

