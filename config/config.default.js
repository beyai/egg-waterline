'use strict';

/**
 * egg-waterline default config
 * @member Config#waterline
 * @property {String} SOME_KEY - some description
 */
exports.waterline = {
  mount: 'model', // 模型目录
  db: { // 数据库配置，内部支持 mongodb , mysql
    default: {
      adapter: 'mongodb', // 数据库
      host: 'localhost',
      port: 27017,
		    database: 'test',
    },
  }
};
