'use strict';

module.exports = function (nemo) {
  return function locatex(locatorJSON) {
    var locale = nemo._config.get('data:locale') || 'default';
    var localizedLocatorJSON = locatorJSON[locale] || locatorJSON['default'] || locatorJSON;
    return localizedLocatorJSON;
  };
};