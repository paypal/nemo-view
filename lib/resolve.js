'use strict';

var path = require('path');

module.exports.locator = function (config, nemo) {
  if (config.constructor === String) {
    return require(path.resolve(nemo.props.autoBaseDir, 'locator', config));
  } else if (config.locator && config.locator.constructor === Object) {
    return config.locator;
  } else if (config.locator && config.locator.indexOf(':') !== -1) {
    var loco = config.locator.split(':');
    if (loco[0] === 'module') {
      //for module style
      return require(loco[1]);
    } else {
      //path style
      return require(path.resolve(nemo.props.autoBaseDir, loco[1]));
    }
  } else {
    //couldn't resolve locator
    throw new Error('[nemo-view] Couldn\'t resolve locator with config: ' + config);
  }
};

module.exports.viewName = function (config) {
  var _viewname = (config.constructor === String) ? config : config.name;
  return _viewname;
};