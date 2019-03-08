'use strict';
const Waterline = require('waterline');
const waterlineUtils = require('waterline-utils');
const path = require('path');
const WATERLINE_MODELS = Symbol('WATERLINE_MODELS');


const ORM_OPTIONS = {
    adapters: {},
    datastores: {},
    models: {},
    defaultModelSettings: {}
}

// 首字母转大写
const capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
};

module.exports = App => {
    const {logger, loader, baseDir} = App;
    const CONF = App.config.waterline;

    if (!CONF.db || Object.keys(CONF.db).length===0) {
        return logger.error(`[egg-waterline] db is required on config`);
    }

    Object.assign( ORM_OPTIONS['defaultModelSettings'], CONF.defaults);

    // 加载适配器
    for (let key in CONF.db) {
        const adapterName = CONF.db[key]['adapter'];

        if (!adapterName) {
            return logger.error(`[egg-waterline] adapter is required on db.${key}`);   
        }

        try {
            ORM_OPTIONS['adapters'][adapterName] = require(adapterName);
            ORM_OPTIONS['datastores'][key] = CONF.db[key];
        } catch(err) {
            logger.error(`[egg-waterline] ${err.message}`);
        }
    }


    // 加载模型文件 
    const modelPath= path.join(baseDir, 'app', CONF.mount || 'model');
    loader.loadToApp(modelPath, WATERLINE_MODELS, {
        inject: App,
        caseStyle: 'upper',
    });


    // 设置模型
    const registerModel = (models, identityName=null, methods = {}) => {

        for (let name in models) {
            const model = models[name];

            if (Object.getOwnPropertySymbols(model).length> 0) {

                if (model.identity) {
                    let identity = capitalize(model.identity);
                    model.identity = identityName ? `${identityName}:${identity}` : identity;
                    methods[identity] =  model.identity
                } else {
                    model.identity = identityName ? `${identityName}:${name}` : name;
                    methods[name] = model.identity;
                }
                ORM_OPTIONS['models'][model.identity] = model;
                // const Model = Waterline.Collection.extend(model);
                // ORM.registerModel(Model);
            } else {
                identityName = identityName ? `${identityName}:${name}` : name;
                methods[name] = {};
                registerModel(model, identityName , methods[name]);
            }
        }

        return methods;
    }

    const GlobalModles = App[CONF.mount || 'model'] = registerModel(App[WATERLINE_MODELS]);

    // 启动ORM服务
    const startServer = function() {
        return new Promise((resolve, reject) => {
        Waterline.start(ORM_OPTIONS, (err, Models) => {
            // ORM.initialize(ORM_OPTIONS, (err, Models) => {
                if (err) return reject(err);
                resolve(Models)
            })
        })
    }

    // 设置全局访问方法
    const setGlobalModles = function( ORM_MODELS ) {
        const setMethods = models => {
            for(let key in models) {
                if ( typeof models[key] === 'string' ) {
                    let value = models[key].toLowerCase();
                    models[key] = ORM_MODELS.collections[value];
                } else {
                    setMethods(models[key]);
                }
            }
        }
        return new Promise((resolve, reject) => {
            // Automigrations
            waterlineUtils.autoMigrations( CONF.migrate, ORM_MODELS, function(err) {
                if (err) return reject(err);
                setMethods(GlobalModles);
                resolve();
            })
        })
    }

    App.beforeStart(async() => {
        try {
            const ORM_MODELS = await startServer();
            await setGlobalModles(ORM_MODELS);
            logger.info(`[egg-waterline] success`);
        } catch(err) {
            logger.error(`[egg-waterline] ${err.message}`);
        }
    })

}