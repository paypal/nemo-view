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
var resolve = require('./lib/resolve');
var glob = require("glob");
var path = require('path');

function addView(nemo) {
	return function(config, hang) {
		//dedupe
		var viewName = resolve.viewName(config);
		//default hang to true
		hang = (hang === undefined) ? true : hang;
		if (nemo.view && nemo.view[viewName] && hang === true) {
			return nemo.view[viewName];
		}
		//error
		if (viewName === 'addView') {
			throw new Error('[nemo-view] reserves "addView". Please rename your view.');
		}

		var _view = View(config, nemo);
		if (hang) {
			nemo.view[viewName] = _view;
		}
		return _view;
	};
}
module.exports.setup = function(nemo, callback) {
	//slap the addView method onto the view namespace
  nemo.view = {};
	nemo.view.addView = addView(nemo);

  //get all files in the locator directory and sub-directories
  glob("**/*.json", {cwd: path.resolve(nemo.data.baseDirectory, 'locator')}, function (err, files) {
    files.map()
    callback(null, nemo);
  });
  //fs.readdir(path.resolve(nemo.data.baseDirectory, 'locator'),function(err,files){
  //  if(err) throw err;
  //  files.forEach(function(file){
  //    console.log('yo ', file);
  //    // do something with each file HERE!
  //  });
  //  callback();
  //});
  //if (args.view) {
  //  args.view.forEach(function(view) {
  //
  //    nemo.view.addView(view);
  //  })
  //}
	//move along
	//callback(null, nemo);
};
