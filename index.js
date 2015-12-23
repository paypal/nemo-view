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
"use strict";
var View = require('./lib/view');
var util = require('./util');
var Locreator = require('./lib/locreator');
var debug = require('debug');
var log = debug('nemo-view:log');
var error = debug('nemo-view:error');
var glob = require("glob");
var path = require('path');
var shush = require('shush');

function addView(nemo, locreator) {

  return function (json, viewNSArray, hang) {
    log('add view', viewNSArray);
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
      error('[nemo-view] There is already a view registered in that namespace');
      throw new Error('[nemo-view] There is already a view registered in that namespace');
    }
    //default hang to true


    var _view = View(nemo, locreator, json);

    viewNS[viewNSArray[viewNSArray.length - 1]] = _view;
    return _view;
  };
}
module.exports.setup = function (_locatorDirectory, _nemo, __callback) {
  log('plugin setup is called');

  //normalize arguments
  var nemo = _nemo;
  var locatorDirectory = _locatorDirectory;
  var _callback = __callback;
  if (arguments.length === 2) {
    locatorDirectory = null;
    nemo = arguments[0];
    _callback = arguments[1];
  }
  var callback = util.once(_callback);

  //add view namespace
  nemo.view = {};

  //instantiate locreator
  var locreator = new Locreator(nemo);

  //get on with it
  locreator.addGenericMethods(nemo);
  nemo.view.addView = addView(nemo, locreator);

  //get all files in the locator directory and sub-directories
  if (locatorDirectory !== null) {
    glob("**/*.json", {cwd: locatorDirectory}, function (err, files) {
      log('going to process the following json into views', files);
      files.forEach(function (file) {
        var addViewArray = [shush(path.resolve(locatorDirectory, file))];
        var viewPathArray = file.split('/');
        viewPathArray[viewPathArray.length - 1] = viewPathArray[viewPathArray.length - 1].split('.json')[0];
        addViewArray.push(viewPathArray);
        try {
          nemo.view.addView.apply(this, addViewArray);
        } catch (err) {
          error(err);
          callback(err);
        }
      });
      callback(null);
    });
  } else {
    callback(null);
  }


};
