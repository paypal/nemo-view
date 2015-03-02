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
var locreator = require('./locreator');
var resolve = require('./resolve');
var _ = require('lodash');


module.exports = function View(viewConfig, nemo) {
  var locator = resolve.locator(viewConfig, nemo),
    viewName = resolve.viewName(viewConfig),
    viewObject = {};

  nemo.locator[viewName] = locator;
  Object.keys(locator).forEach(function (locatorId) {
    var locatorJSON = nemo.locatex(viewName, locatorId);

    if (locator[locatorId].Elements) {
      viewObject[locatorId] = function () { //give back the nemo.view.viewname.list() function
        return nemo.drivex.finds(locatorJSON[locatorId]).then(function (parentWebElements) {
          return nemo.wd.promise.map(parentWebElements, function (parentWebElement) {
            var parentObject = {};
            Object.keys(locator[locatorId].Elements).forEach(function (childLocatorId) {
              var childLocatorJSON = nemo.locatex(viewName, locatorId, 'Elements', childLocatorId);
              _.merge(parentObject, locreator(nemo, childLocatorId, childLocatorJSON, parentWebElement));
            });
            return parentObject;
          });
        });
      };
    } else {
      _.merge(viewObject, locreator(nemo, locatorId, locatorJSON));
    }
  });
  return viewObject;
};

