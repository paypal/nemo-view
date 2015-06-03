'use strict';

module.exports = function (nemo) {
  return function locatex(locatorJSON) {
    var locale = (nemo.data && nemo.data.locale) ? nemo.data.locale : 'default',
      locatr = locatorJSON;
    return locatr[locale] || locatr['default'] || locatr;
  };
};