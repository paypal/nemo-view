'use strict';
var Drivex = require('selenium-drivex');
var async = require('async');

var _by = function(nemo, locator) {
  return nemo.wd.By[locator.type](locator.locator);
};

module.exports.by = _by;
module.exports.create = function locreator(nemo, locatorId, locatorJSON, parentWebElement) {
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
    function waitReturnElement() {
      return drivex.waitForElement(by(locatorJSON), timeout || 5000, msg).then(function() {
        return drivex.find(by(locatorJSON), parentWebElement);
      });
    }
    var wep = new nemo.wd.WebElementPromise(nemo.driver, waitReturnElement());
    return wep;
  };
  locatorObject[locatorId + 'WaitVisible'] = function (timeout, msg) {
    function waitVisibleReturnElement() {
      return nemo.driver.wait(function () {
        return drivex.visible(by(locatorJSON));
      }, timeout || 5000, msg).then(function() {
        return drivex.find(by(locatorJSON), parentWebElement);
      });
    }
    var wep = new nemo.wd.WebElementPromise(nemo.driver, waitVisibleReturnElement());
    return wep;
  };
  locatorObject[locatorId + 'Visible'] = function () {
    return drivex.visible(by(locatorJSON), parentWebElement);
  };
  locatorObject[locatorId + 'OptionText'] = function (optionText) {
    var d = nemo.wd.promise.defer();
    drivex.find(by(locatorJSON), parentWebElement).then(function (selectEl) {
      selectEl.findElements(nemo.wd.By.css('option')).then(function (elts) {
        var current = 0;
        var total = elts.length;
        var found = false;
        async.whilst(
          function () {
            return current < total;
          },
          function (callback) {
            var elt = elts[current++];
            elt.getText().then(function (txt) {
              if (txt === optionText) {
                found = elt;
              }
              callback();
            });
          },
          function (err) {
            if (found !== false) {
              d.fulfill(found.click());
            } else {
              d.reject(new Error('couldn\'t find option with text: ' + optionText));
            }
          }
        );
      });
    });
    return d;
  };
  locatorObject[locatorId + 'OptionValue'] = function (optionValue) {
    //select an option by its value (works only for Select elements)
    return drivex.find(by(locatorJSON), parentWebElement).then(function (selectEl) {
      return selectEl.findElement(nemo.wd.By.css('option[value=\'' + optionValue + '\']')).then(function (element) {
        return element.click();
      }, function (err) {
        throw new Error(err);
      });
    }, function (err) {
      throw new Error(err);
    });
  };
  return locatorObject;
};

