'use strict';

/**
 * egg-waterline default config
 * @member Config#waterline
 * @property {String} SOME_KEY - some description
 */
exports.waterline = {
	app : true,
    agent : false,
    mount: 'model', // 模型目录
    migrate: "safe", 	// 数据迁移 safe|drop|alter
    defaults: {
		//模型默认设置
    },
    db: { 
		// 数据库配置
        default: { //数据库名称
            adapter: 'sails-mysql', // 数据库适配器，
            host: 'localhost',
            database: 'testbase',
        }
    }
};
