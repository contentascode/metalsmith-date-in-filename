var _ = require('lodash');

module.exports = function(options){
  var override = (('boolean' === typeof options) && options) || ('object' === typeof options && options.override) || false;
  return function drafts(files, metalsmith, done){
    _.forEach(files, function (fileMeta, fileName) {
      if (!override && fileMeta.date) {
          return;
      }
      var m;
      if (m = fileName.match(/(\d{4}-\d{2}-\d{2})/)) {
          fileMeta.date = new Date(m[1]);
          if (options.basename) fileMeta[options.basename] = fileMeta.basename.replace(/(\d{4}-\d{2}-\d{2})/g, '').replace(/^[^a-z\d]*|[^a-z\d]*$/gi, '')
      } else if (m = fileName.match(/(\d{8})/)) {
          fileMeta.date = new Date(
              m[1].substr(0, 4) +'-'+
              m[1].substr(4, 2) +'-'+
              m[1].substr(6, 2)
          );
          if (options.basename) fileMeta[options.basename] = fileMeta.basename.replace(/(\d{8})/g, '').replace(/^[^a-z\d]*|[^a-z\d]*$/gi, '')
      }
    });
    var filesWithoutContents = _.zipObject(_.map(files, function (fileMeta, fileName) {
        var filteredFileMeta = _.reduce(fileMeta, function (acc, metaValue, metaName) {
            if ('contents' !== metaName) {
                acc[metaName] = metaValue;
            }
            return acc;
        }, {});
        return [fileName, filteredFileMeta];
    }));
    done();
  };
};
