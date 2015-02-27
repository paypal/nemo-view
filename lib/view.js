/*───────────────────────────────────────────────────────────────────────────*\
 │  Copyright (C) 2014 eBay Software Foundation                                │
 │                                                                             │
 │                                                                             │
 │   Licensed under the Apache License, Version 2.0 (the "License"); you may   │
 │   not use this file except in compliance with the License. You may obtain   │
 │   a copy of the License at http://www.apache.org/licenses/LICENSE-2.0       │
 │                                                                             │
 │   Unless required by applicable law or agreed to in writing, software       │
 │   distributed under the License is distributed on an "AS IS" BASIS,         │
 │   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  │
 │   See the License for the specific language governing permissions and       │
 │   limitations under the License.                                            │
 \*───────────────────────────────────────────────────────────────────────────*/
/* global require: true, module: true */
'use strict';
/*
 a view should:
 implement an interface with the following functionality
 take nemo config as constructor argument
 load its locator file (../locator/viewName)
 find (all locators: e.g. findSubmitButton)
 isVisible (all locators: e.g. isSubmitButtonVisible)
 isPresent (all locators: e.g. isSubmitButtonPresent)
 instantiate any subviews
 */
var async = require('async');
var path = require('path');


var View = function (viewConfig, nemo) {
  var locator = resolveLocator(viewConfig, nemo),
    viewName = resolveViewName(viewConfig),
    viewObject = {};

  nemo.locator[viewName] = locator;
  Object.keys(locator).forEach(function (locatorId) {
    var locatorJSON = nemo.locatex(viewName + "." + locatorId);

    if (locator[locatorId].Elements) {
      viewObject[locatorId] = function () { //give back the nemo.view.viewname.list() function
        return nemo.drivex.finds(locatorJSON).then(function (parentWebElements) {
          return nemo.wd.promise.map(parentWebElements, function (parentWebElement) { //
            var parentObject = {};
            Object.keys(locator[locatorId].Elements).forEach(function (childLocatorId) {
              var childLocatorJSON = nemo.locatex(viewName + "." + locatorId + ".Elements." + childLocatorId);
              locreator(nemo, parentObject, childLocatorId, childLocatorJSON, parentWebElement);
            });
            return parentObject;
          });
        });
      };
    } else {
      locreator(nemo, viewObject, locatorId, locatorJSON);
    }
  });
  return viewObject;
};
//privates
var locreator = function (nemo, viewObject, locatorId, locatorJSON, parentWebElement) {
    viewObject[locatorId + "By"] = function () {
      return nemo.drivex.by(locatorJSON);
    };
    viewObject[locatorId + "Present"] = function () {
      return nemo.drivex.present(locatorJSON, parentWebElement);
    };
    viewObject[locatorId] = function () {
      return nemo.drivex.find(locatorJSON, parentWebElement);
    };
    viewObject[locatorId + "Wait"] = function (timeout, msg) {
      function waitReturnElement() {
        return nemo.drivex.waitForElement(locatorJSON, timeout || 5000, msg).then(function() {
          return nemo.drivex.find(locatorJSON, parentWebElement);
        });
      }
      var wep = new nemo.wd.WebElementPromise(nemo.driver, waitReturnElement());
      return wep;
    };
    viewObject[locatorId + "WaitVisible"] = function (timeout, msg) {
      function waitVisibleReturnElement() {
        return nemo.driver.wait(function () {
          return nemo.drivex.visible(locatorJSON);
        }, timeout || 5000, msg).then(function() {
          return nemo.drivex.find(locatorJSON, parentWebElement);
        });
      }
      var wep = new nemo.wd.WebElementPromise(nemo.driver, waitVisibleReturnElement());
      return wep;
    };
    viewObject[locatorId + "Visible"] = function () {
      return nemo.drivex.visible(locatorJSON, parentWebElement);
    };
    viewObject[locatorId + "OptionText"] = function (optionText) {
      var d = nemo.wd.promise.defer();
      nemo.drivex.find(locatorJSON, parentWebElement).then(function (selectEl) {
        selectEl.findElements(nemo.wd.By.css("option")).then(function (elts) {
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
                d.reject(new Error("couldn't find option with text: " + optionText));
              }
            }
          );
        });
      });
      return d;
    };
    viewObject[locatorId + "OptionValue"] = function (optionValue) {
      //select an option by its text (works only for Select elements)
      nemo.drivex.find(locatorJSON, parentWebElement).then(function (selectEl) {
        return selectEl.findElement(nemo.wd.By.css("option[value='" + optionValue + "']")).click();
      });
    };
  },
  resolveLocator = function (config, nemo) {
    if (config.constructor === String) {
      return require(path.resolve(nemo.props.autoBaseDir, "locator", config));
    } else if (config.locator && config.locator.constructor === Object) {
      return config.locator;
    } else if (config.locator && config.locator.indexOf(":") !== -1) {
      var loco = config.locator.split(":");
      if (loco[0] === "module") {
        //for module style
        return require(loco[1]);
      } else {
        //path style
        return require(path.resolve(nemo.props.autoBaseDir, loco[1]));
      }
    } else {
      //couldn't resolve locator
      throw new Error("[nemo-view] Couldn't resolve locator with config: " + config);
    }
  },
  resolveViewName = function (config) {
    var _viewname = (config.constructor === String) ? config : config.name;
    return _viewname;
  };
module.exports.View = View;
module.exports.resolveViewName = resolveViewName;
