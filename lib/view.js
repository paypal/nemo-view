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
 find (all viewJSON: e.g. findSubmitButton)
 isVisible (all viewJSON: e.g. isSubmitButtonVisible)
 isPresent (all viewJSON: e.g. isSubmitButtonPresent)
 instantiate any subviews
 */
var locreator = require('./locreator');
var Drivex = require('selenium-drivex');
var Locatex = require('./locatex');
var _ = require('lodash');


module.exports = function View(nemo, viewJSON) {
    var locatex = Locatex(nemo),
    drivex = Drivex(nemo.driver),
    viewObject = {};
  Object.keys(viewJSON).forEach(function (locatorId) {
    var locatorJSON = locatex(viewJSON, [locatorId]);

    if (viewJSON[locatorId].Elements) {
      viewObject[locatorId] = function () { //give back the nemo.view.viewname.list() function
        return drivex.finds(locreator.by(nemo, locatorJSON)).then(function (parentWebElements) {
          return nemo.wd.promise.map(parentWebElements, function (parentWebElement) {
            var parentObject = {};
            Object.keys(viewJSON[locatorId].Elements).forEach(function (childLocatorId) {
              var childLocatorJSON = locatex(viewJSON, [locatorId, 'Elements', childLocatorId]);
              var locreated = locreator.addStarMethods(nemo, childLocatorId, childLocatorJSON, parentWebElement);
              _.merge(parentObject, locreated);
            });
            return parentObject;
          });
        });
      };
    } else {
      _.merge(viewObject, locreator.addStarMethods(nemo, locatorId, locatorJSON));
    }
  });
  return viewObject;
};

