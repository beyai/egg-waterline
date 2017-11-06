'use strict';
const path = require('path');
const assert = require('assert');
const MODELS = Symbol('loadedModels');
const Waterline = require('waterline');
  
const waterline = new Waterline();
let wlconfig = {
    adapters: {},
    connections: {},
};

// 首字母转大写
const capitalize = function (string) {
    return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
};
 
module.exports = app => {
    const config = app.config.waterline;
    assert(config.db, '[egg-waterline] db is required on config');
    wlconfig.connections = config.db;
    
    for (const key of Object.keys(config.db)) {
        const item = config.db[key].adapter
        switch (item) {
        case 'mongodb':
            wlconfig.adapters[item] = require('sails-mongo');
            break;
        case 'mysql':
            wlconfig.adapters[item] = require('sails-mysql');
            break;
        default:
            assert(item, 'adapter illegal');
            break;
        }
    }
    
    // 模型挂载到app的名称
    const mountName = app.config.waterline.mount || 'model';
    app[mountName] = {};

    loadModel(app);

    app.beforeStart( async() => {
        let Models = await connectDB( app ).catch(err=>{
            app.coreLogger.error('[egg-waterline] initialize failed');
        });
        for (const name of Object.keys(Models.collections)) {
            const modelName = capitalize(name);
            app[mountName][modelName] = Models.collections[name];
        }
        app.coreLogger.info('[egg-waterline] initialize successful');
    });
};

// 连接数据库服务器
function connectDB () {
    return new Promise((resolve, reject) => {
        waterline.initialize( wlconfig, function (err, Models) {
            if (err) return reject(err);
            resolve( Models );
        });
    });
}

// 加载数据模型
function loadModel(app) {
    const modelDir = path.join(app.baseDir, 'app', app.config.waterline.mount || 'model');
 
    app.loader.loadToApp(modelDir, MODELS, {
        inject: app,
        caseStyle: 'upper',
    });
 
    for (const name of Object.keys(app[MODELS])) {
        let klass = app[MODELS][name];
        klass.migrate = "safe";
        const Model = Waterline.Collection.extend(klass);
        waterline.loadCollection(Model);
    }
}