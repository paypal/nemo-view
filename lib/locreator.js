'use strict';
var Drivex = require('selenium-drivex');
var _ = require('lodash');
var normalize = require('./normalize');

module.exports.addGenericMethods = function generics(nemo) {
  var normify = function (locator) {
    return normalize(nemo, locator);
  };
  var drivex = Drivex(nemo.driver, nemo.wd);

  nemo.view._find = function (locator) {
    return drivex.find(normify(locator));
  };
  nemo.view._finds = function (locator) {
    return drivex.finds(normify(locator));
  };
  nemo.view._present = function (locator) {
    return drivex.present(normify(locator));
  };
  nemo.view._visible = function (locator) {
    return drivex.visible(normify(locator));
  };
  nemo.view._wait = function (locator, timeout) {
    return drivex.waitForElementPromise(normify(locator), timeout);
  };
  nemo.view._waitVisible = function (locator, timeout) {
    return drivex.waitForElementVisiblePromise(normify(locator), timeout || 5000);
  };
  nemo.view._firstVisible = function (_locatorObject, timeout) {
    //transform _locatorObject to use native selenium-webdriver Locator format
    var locatorObject = _.transform(_locatorObject, function(result, n, key) {
      result[key] = normify(_locatorObject[key]);
    });
    return drivex.firstVisible(locatorObject, timeout);
  };

};
module.exports.addStarMethods = function locreator(nemo, locatorId, _locator, parentWebElement) {
  var locatorObject = {};
  var drivex = Drivex(nemo.driver, nemo.wd);
  var locator = normalize(nemo, _locator);

  locatorObject[locatorId] = function () {
    return drivex.find(locator, parentWebElement);
  };
  locatorObject[locatorId + 'By'] = function () {
    return locator;
  };
  locatorObject[locatorId + 'Present'] = function () {
    return drivex.present(locator, parentWebElement);
  };
  locatorObject[locatorId + 'Wait'] = function (timeout, msg) {
    return drivex.waitForElementPromise(locator, timeout || 5000, msg);
  };
  locatorObject[locatorId + 'WaitVisible'] = function (timeout, msg) {
    return drivex.waitForElementVisiblePromise(locator, timeout || 5000, msg);
  };
  locatorObject[locatorId + 'Visible'] = function () {
    return drivex.visible(locator, parentWebElement);
  };
  locatorObject[locatorId + 'OptionText'] = function (optionText) {
    return drivex.selectByOptionText(locator, optionText, parentWebElement);
  };
  locatorObject[locatorId + 'OptionValue'] = function (optionValue) {
    return drivex.selectByOptionValue(locator, optionValue, parentWebElement);
  };
  return locatorObject;
};

