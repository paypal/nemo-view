'use strict';
var Drivex = require('selenium-drivex');
var Locatex = require('./locatex');
var _ = require('lodash');
var normalize = require('./normalize');

var Locreator = function (nemo) {
  this.nemo = nemo;
  this.drivex = Drivex(nemo.driver, nemo.wd);
  this.locatex = Locatex(nemo);
  this.normify = this.normalize = function (locator) {
    return normalize(nemo, locator);
  };
};
Locreator.prototype.addGenericMethods = function generics() {
  var normify = this.normify;
  var drivex = this.drivex;
  var nemo = this.nemo;

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
  nemo.view._wait = function (locator, timeout, msg) {
    return drivex.waitForElementPromise(normify(locator), timeout, msg);
  };
  nemo.view._waitVisible = function (locator, timeout, msg) {
    return drivex.waitForElementVisiblePromise(normify(locator), timeout || 5000, msg);
  };
  nemo.view._firstVisible = function (_locatorObject, timeout) {
    //transform _locatorObject to use native selenium-webdriver Locator format
    var locatorObject = _.transform(_locatorObject, function (result, n, key) {
      result[key] = normify(_locatorObject[key]);
    });
    return drivex.firstVisible(locatorObject, timeout);
  };
};

Locreator.prototype.addStarMethods = function locreator(locatorId, _locator, parentWebElement) {
  var locatorObject = {};
  var drivex = this.drivex;
  var locator = this.normify(_locator);

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

Locreator.prototype.addGroup = function (viewJSON, locator, locatorId) {
  var nemo = this.nemo;
  var drivex = this.drivex;
  var locatex = this.locatex;
  var self = this;
  return function () { //give back the nemo.view.viewname.list() function
    return drivex.finds(normalize(nemo, locator)).then(function (parentWebElements) {
      return nemo.wd.promise.map(parentWebElements, function (parentWebElement) {
        var parentObject = {};
        Object.keys(viewJSON[locatorId].Elements).forEach(function (childLocatorId) {
          var childLocator = locatex(viewJSON, [locatorId, 'Elements', childLocatorId]);
          var starMethods = self.addStarMethods(childLocatorId, childLocator, parentWebElement);
          _.merge(parentObject, starMethods);
        });
        return parentObject;
      });
    });
  };
};

module.exports = Locreator;