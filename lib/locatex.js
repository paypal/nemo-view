'use strict';

module.exports = function (nemo) {
  return function locatex(viewJSON, locatorArray) {
    var locale = (nemo.data && nemo.data.locale) ? nemo.data.locale : 'default',
      locatr = viewJSON;
    locatorArray.forEach(function (level) {
      locatr = locatr[level];
    });
    return locatr[locale] || locatr['default'] || locatr;
  };
};