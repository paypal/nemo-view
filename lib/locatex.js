'use strict';

module.exports = nemo => {
  return function locatex(locatorJSON) {
    const locale = nemo._config.get('data:locale') || 'default';
    let localizedLocatorJSON = locatorJSON[locale] || locatorJSON['default'] || locatorJSON;
    return localizedLocatorJSON;
  };
};