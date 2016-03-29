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
 * if input object is already a selenium Locator then the same object is returned
 * @param nemo
 * @param _locator {String or Object}
 * @returns Locator
 */
module.exports = function normalize(nemo, _locator) {
  var locator = _locator;
  var normalizedLocator;

  //get a hold of webdriver.Locator.  It's the same for all strategies.
  var Locator = nemo.wd.By.id('xyz').constructor;
  if (locator instanceof Locator) {
    return locator; //already normalized
  }
  if (locator.constructor !== String) {
    if (!locator.locator || !locator.locator.trim()) {
      throw new Error('NO or EMPTY locator found, please fix it');
    }
    if (!locator.type || !locator.type.trim() || !nemo.wd.By[locator.type]) {
      throw new Error('NO or EMPTY or invalid locator Type found, please fix it');
    }
  }
  if (_locator.constructor === String) {
    locator = _splitLocator(nemo, _locator);
  }
  normalizedLocator = nemo.wd.By[locator.type](locator.locator);
  return normalizedLocator;
};