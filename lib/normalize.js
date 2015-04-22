'use strict';

/**
 *
 * @param locatorString string defining a WebElement locator as defined in this module's README
 * @returns Object {{type: *, locator: *}}
 * @private
 */
var _splitLocator = function (locatorString) {
  var splitLocator = locatorString.split(':');
  if (splitLocator.length === 1) {
    splitLocator[1] = splitLocator[0];
    splitLocator[0] = 'css';
  }
  var locator = {
    'type': splitLocator[0],
    'locator': splitLocator[1]
  };
  return locator;
};

/**
 * normalizes either string or object locator definition to a selenium Locator object
 * @param nemo
 * @param _locator {String or Object}
 * @returns Locator
 */
module.exports = function normalize(nemo, _locator) {
  var locator = _locator;
  if (_locator.constructor === String) {
    locator = _splitLocator(_locator);
  }
  return nemo.wd.By[locator.type](locator.locator);
};