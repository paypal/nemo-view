'use strict';
var Drivex = require('selenium-drivex');
var async = require('async');

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
  nemo.view._wait = function (locatorString, timeout) {
    function waitReturnElement() {
      return drivex.waitForElement(_by(nemo, splitLocator(locatorString)), timeout || 5000);
    }

    var wep = new nemo.wd.WebElementPromise(nemo.driver, waitReturnElement());
    return wep;
  };
  nemo.view._waitVisible = function (locatorString, timeout) {
    var loc = _by(nemo, splitLocator(locatorString));

    function waitVisibleReturnElement() {
      return drivex.waitForElementVisible(loc, timeout || 5000);
    }

    var wep = new nemo.wd.WebElementPromise(nemo.driver, waitVisibleReturnElement());
    return wep;
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
    function waitReturnElement() {
      return drivex.waitForElement(by(locatorJSON), timeout || 5000, msg);
    }

    var wep = new nemo.wd.WebElementPromise(nemo.driver, waitReturnElement());
    return wep;
  };
  locatorObject[locatorId + 'WaitVisible'] = function (timeout, msg) {
    function waitVisibleReturnElement() {
      return drivex.waitForElementVisible(by(locatorJSON), timeout || 5000, msg);
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

