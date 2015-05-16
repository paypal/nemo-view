'use strict';
var Drivex = require('selenium-drivex');
var _ = require('lodash');
var _by = function (nemo, locator) {
  return nemo.wd.By[locator.type](locator.locator);
};

var splitLocator = function (locatorString) {
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
module.exports.by = _by;
module.exports.addGenericMethods = function generics(nemo) {
  var drivex = Drivex(nemo.driver, nemo.wd);
  nemo.view._find = function (locatorString) {
    return drivex.find(_by(nemo, splitLocator(locatorString)));
  };
  nemo.view._finds = function (locatorString) {
    return drivex.finds(_by(nemo, splitLocator(locatorString)));
  };
  nemo.view._present = function (locatorString) {
    return drivex.present(_by(nemo, splitLocator(locatorString)));
  };
  nemo.view._visible = function (locatorString) {
    return drivex.visible(_by(nemo, splitLocator(locatorString)));
  };
  nemo.view._wait = function (locatorString, timeout, msg) {
    return drivex.waitForElementPromise(_by(nemo, splitLocator(locatorString)), timeout, msg);
  };
  nemo.view._waitVisible = function (locatorString, timeout, msg) {
    var loc = _by(nemo, splitLocator(locatorString));
    return drivex.waitForElementVisiblePromise(loc, timeout || 5000, msg);
  };
  nemo.view._firstVisible = function (_locatorObject, timeout) {
    //transform _locatorObject to use native selenium-webdriver Locator format
    var locatorObject = _.transform(_locatorObject, function(result, n, key) {
      result[key] = _by(nemo, splitLocator(_locatorObject[key]));
    });
    return drivex.firstVisible(locatorObject, timeout);
  };

};
module.exports.addStarMethods = function locreator(nemo, locatorId, locatorJSON, parentWebElement) {
  if (locatorJSON.locator === undefined || locatorJSON.type === undefined) {
    throw new Error('[nemo-drivex] malformed locator');
  }
  var locatorObject = {};
  var drivex = Drivex(nemo.driver, nemo.wd);

  function by(locator) {
    return _by(nemo, locator);
  }

  locatorObject[locatorId] = function () {
    return drivex.find(by(locatorJSON), parentWebElement);
  };
  locatorObject[locatorId + 'By'] = function () {
    return by(locatorJSON);
  };
  locatorObject[locatorId + 'Present'] = function () {
    return drivex.present(by(locatorJSON), parentWebElement);
  };
  locatorObject[locatorId + 'Wait'] = function (timeout, msg) {
    return drivex.waitForElementPromise(by(locatorJSON), timeout || 5000, msg);
  };
  locatorObject[locatorId + 'WaitVisible'] = function (timeout, msg) {
    return drivex.waitForElementVisiblePromise(by(locatorJSON), timeout || 5000, msg);
  };
  locatorObject[locatorId + 'Visible'] = function () {
    return drivex.visible(by(locatorJSON), parentWebElement);
  };
  locatorObject[locatorId + 'OptionText'] = function (optionText) {
    return drivex.selectByOptionText(by(locatorJSON), optionText, parentWebElement);
  };
  locatorObject[locatorId + 'OptionValue'] = function (optionValue) {
    return drivex.selectByOptionValue(by(locatorJSON), optionValue, parentWebElement);
  };
  return locatorObject;
};

