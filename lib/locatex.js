'use strict';

module.exports = function (nemo) {
  return function locatex(_locator) {
    var locale = (nemo.data && nemo.data.locale) ? nemo.data.locale : 'default',
      args = Array.prototype.slice.call(arguments),
      locatorArray = (args.length > 1) ? args : arguments[0].split('.'),
      locatr = nemo.locator;
    console.log('locatr', locatr);
    locatorArray.forEach(function (level) {
      console.log('level', level)
      locatr = locatr[level];
    });
    return locatr[locale] || locatr['default'] || locatr;

  };
}