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
"use strict";
var View = require('./lib/view');
var glob = require("glob");
var path = require('path');

function addView(nemo) {
	return function(json, viewNSArray, hang) {
    var viewNS = (hang !== undefined && hang === false) ? {} : nemo.view;
    //error
    if (viewNSArray[0] === 'addView') {
      throw new Error('[nemo-view] reserves "addView". Please rename your view.');
    }
    if (viewNSArray[0].indexOf('_') === 0) {
      throw new Error('[nemo-view] reserves any name starting with _. Please rename your view.');
    }
    for (var i = 0; i < viewNSArray.length - 1; i++) {
      viewNS[viewNSArray[i]] = (viewNS[viewNSArray[i]]) ? viewNS[viewNSArray[i]] : {};
      viewNS = viewNS[viewNSArray[i]];
    }
		if (viewNS[viewNSArray[viewNSArray.length - 1]] !== undefined) {
      throw new Error('[nemo-view] There is already a view registered in that namespace');
    }
		//default hang to true


		var _view = View(nemo, json);

    viewNS[viewNSArray[viewNSArray.length - 1]] = _view;
    return _view;
	};
}
module.exports.setup = function(locatorDirectory, nemo, callback) {
	//slap the addView method onto the view namespace
  nemo.view = {};
	nemo.view.addView = addView(nemo);

  //get all files in the locator directory and sub-directories
  glob("**/*.json", {cwd: locatorDirectory}, function (err, files) {
    files.forEach(function(file) {
      var addViewArray = [require(path.resolve(locatorDirectory, file))];
      var viewPathArray = file.split('/');
      viewPathArray[viewPathArray.length - 1] = viewPathArray[viewPathArray.length - 1].split('.json')[0];
      addViewArray.push(viewPathArray);
      nemo.view.addView.apply(this, addViewArray);
    });
    callback(null);
  });

};
