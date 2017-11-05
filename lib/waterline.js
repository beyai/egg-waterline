const path = require('path');
const assert = require('assert');
const MODELS = Symbol('loadedModels');
const Waterline = require('waterline');

const waterline = new Waterline();

// 首字母转大写
const capitalize = function(string) {
  return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
};

module.exports = app => {
  const config = app.config.waterline;
  assert(config.db, '[egg-waterline] db is required on config');

  const wlconfig = {
    adapters: {},
    connections: {},
  };

  wlconfig.connections = config.db;

  for (const key of Object.keys(config.db)) {
    const item = config.db[key].adapter
    switch ( item ) {
      case 'mongodb':
        wlconfig.adapters[ item ] = require('sails-mongo');
        break;
      case 'mysql':
        wlconfig.adapters[ item ] = require('sails-mysql');
        break;
      default :
        assert( item , 'adapter illegal');
        break;
    }
  }


  app.model = {};
  loadModel(app);

  app.beforeStart(async () => {
    waterline.initialize( wlconfig , async (err, Models) => {
      if (err) {
        assert(err);
        return;
      }
      for (const name of Object.keys(Models.collections)) {
        const modelName = capitalize(name);
        app.model[modelName] = Models.collections[name];
      }
      app.coreLogger.info('[egg-waterline] initialize successful');
    });
  });
};

function loadModel(app) {
  const modelDir = path.join(app.baseDir, 'app', app.config.waterline.mount || 'model');

  app.loader.loadToApp(modelDir, MODELS, {
    inject: app,
    caseStyle: 'upper',
  });

  for (const name of Object.keys(app[MODELS])) {
    const klass = app[MODELS][name];
    const Model = Waterline.Collection.extend(klass);
    waterline.loadCollection(Model);
  }
}
