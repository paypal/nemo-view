'use strict';

/**
 *
 * @param locatorString string defining a WebElement locator as defined in this module's README
 * @returns Object {{type: *, locator: *}}
 * @private
 */
var _splitLocator = function (nemo, locatorString) {
  var strategy = locatorString.substr(0, locatorString.indexOf(':'));
  var locator = '';
  if (strategy.length > 0 && nemo.wd.By[strategy] !== undefined) {
    locator = locatorString.substr(locatorString.indexOf(':') + 1, locatorString.length);
  } else {
    strategy = 'css';
    locator = locatorString;
  }

  var jsonLocator = {
    'type': strategy,
    'locator': locator
  };
  return jsonLocator;
};

/**
 * normalizes either string or object locator definition to a selenium Locator object
 * @param nemo
 * @param _locator {String or Object}
 * @returns Locator
 */
module.exports = function normalize(nemo, _locator) {
  var locator = _locator;
  var normalizedLocator;
  if (_locator.constructor === String) {
    locator = _splitLocator(nemo, _locator);
  }
  normalizedLocator = nemo.wd.By[locator.type](locator.locator);
  return normalizedLocator;
};