'use strict';
var Drivex = require('selenium-drivex');
var Locatex = require('./locatex');
var _ = require('lodash');
var normalize = require('./normalize');
var debug = require('debug');
var log = debug('nemo-view:log');

var Locreator = function (nemo) {
  log('creating Locreator instance');
  this.nemo = nemo;
  this.drivex = Drivex(nemo.driver, nemo.wd);
  this.locatex = Locatex(nemo);
  this.normify = this.normalize = function (locator) {
    return normalize(nemo, locator);
  };
};
Locreator.prototype.addGenericMethods = function generics() {
  log('adding generic methods');
  var normify = this.normify;
  var drivex = this.drivex;
  var nemo = this.nemo;

  nemo.view._find = function (locator, parentElement) {
    return drivex.find(normify(locator), parentElement);
  };
  nemo.view._finds = function (locator, parentElement) {
    return drivex.finds(normify(locator), parentElement);
  };
  nemo.view._present = function (locator, parentElement) {
    return drivex.present(normify(locator), parentElement);
  };
  nemo.view._visible = function (locator, parentElement) {
    return drivex.visible(normify(locator), parentElement);
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

Locreator.prototype.addStarMethods = function addStarMethods(locatorId, locatorJSON, parentWebElement) {
  log('add star methods for %s', locatorId);
  var locatorObject = {};
  var drivex = this.drivex;
  var locreator = this;
  var locator = function () {
    return locreator.normify(locreator.locatex(locatorJSON));
  };

  //this is an error check. if an error thrown, invalid locatorJSON.
  locator();

  locatorObject[locatorId] = function () {
    return drivex.find(locator(), parentWebElement);
  };
  locatorObject[locatorId + 'By'] = function () {
    return locator();
  };
  locatorObject[locatorId + 'Present'] = function () {
    return drivex.present(locator(), parentWebElement);
  };
  locatorObject[locatorId + 'Wait'] = function (timeout, msg) {
    return drivex.waitForElementPromise(locator(), timeout || 5000, msg || 'Not locatable: nemo-view with locatorId "' + locatorId);
  };
  locatorObject[locatorId + 'WaitVisible'] = function (timeout, msg) {
    return drivex.waitForElementVisiblePromise(locator(), timeout || 5000, msg || 'Not locatable: nemo-view with locatorId "' + locatorId);
  };
  locatorObject[locatorId + 'Visible'] = function () {
    return drivex.visible(locator(), parentWebElement);
  };
  locatorObject[locatorId + 'OptionText'] = function (optionText) {
    return drivex.selectByOptionText(locator(), optionText, parentWebElement);
  };
  locatorObject[locatorId + 'OptionValue'] = function (optionValue) {
    return drivex.selectByOptionValue(locator(), optionValue, parentWebElement);
  };
  locatorObject[locatorId + 'TextEquals'] = function (value) {
    return drivex.validateText(locator(), parentWebElement, value) ;
  };
  locatorObject[locatorId + 'AttrEquals'] = function (attribute, value) {
    return drivex.validateAttributeValue(locator(), parentWebElement, attribute, value);
  };
  return locatorObject;
};

Locreator.prototype.addGroup = function (locatorId, locatorJSON) {
  var nemo = this.nemo;
  var drivex = this.drivex;
  var locreator = this;
  return function () { //give back the nemo.view.viewname.list() function
    var localizedJSON = locreator.locatex(locatorJSON);
    return drivex.finds(locreator.normify(localizedJSON)).then(function (parentWebElements) {
      return nemo.wd.promise.map(parentWebElements, function (parentWebElement) {
        var parentObject = {};
        Object.keys(localizedJSON.Elements).forEach(function (childLocatorId) {
          var childLocatorJSON = localizedJSON.Elements[childLocatorId];
          var starMethods = locreator.addStarMethods(childLocatorId, childLocatorJSON, parentWebElement);
          _.merge(parentObject, starMethods);
        });
        return parentObject;
      });
    });
  };
};

module.exports = Locreator;