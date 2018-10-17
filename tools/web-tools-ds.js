var _ = require('lodash'),
    JSData = require('js-data');

module.exports = function setUpDS(gulp) {
  var dsConfig = _.get(gulp, 'webToolsConfig.dataStore', {}),
      DS;

  function abortAsync(resource, data, callback) {
    return new Promise(function promiser(resolve, reject) {
      reject(new Error('Asynchronous actions are not allowed.'));
    });
  }

  if (!!dsConfig.models) {
    DS = new JSData.DS(_.assign({
      linkRelations: true,
      beforeCreate: abortAsync,
      beforeUpdate: abortAsync,
      beforeDestroy: abortAsync,
      beforeFind: abortAsync
    }, dsConfig.settings));

    // Define all models
    _.each(dsConfig.models, function defineModel(modelConstructor) {
      var model = modelConstructor(DS);

      DS.defineResource(model);
    });

    gulp.ds = DS;
  } else {
    gulp.ds = {};
  }

  // Add the default pipelines to the cache
  gulp.pipelineCache.put('yaml-reader', require('./pipelines/pipeline.yaml-reader.js'));
  gulp.pipelineCache.put('md-reader', require('./pipelines/pipeline.md-reader.js'));
  gulp.pipelineCache.put('datastore', require('./pipelines/pipeline.datastore.js'));
  gulp.pipelineCache.put('datastore-computeAll', require('./pipelines/pipeline.datastore-compute-all.js'));
};
