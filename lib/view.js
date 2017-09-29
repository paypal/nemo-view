/*───────────────────────────────────────────────────────────────────────────*\
 │  Copyright (C) 2014 PayPal                                                  │
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
const _ = require('lodash');

module.exports = function View(nemo, locreator, viewJSON) {
  return _.transform(viewJSON,  (_viewObject, n, locatorId) => {
    const locatorJSON = viewJSON[locatorId];
    if (locreator.locatex(locatorJSON).Elements) {
      _viewObject[locatorId] = locreator.addGroup(locatorJSON);
    } else {
      _.merge(_viewObject, locreator.addStarMethods(locatorId, locatorJSON));
    }
  });
};

