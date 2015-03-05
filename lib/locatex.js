'use strict';

module.exports = function locatex(_locator) {
  var locale = (nemo.props && nemo.props.locale) ? nemo.props.locale : 'default',
    args = Array.prototype.slice.call(arguments),
    locatorArray = (args.length > 1) ? args : arguments[0].split('.'),
    locatr = nemo.locator;
  locatorArray.forEach(function (level) {
    locatr = locatr[level];
  });
  return locatr[locale] || locatr['default'] || locatr;

};