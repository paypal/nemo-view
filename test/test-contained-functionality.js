/* global describe,beforeEach,it */

'use strict';

var nemoFactory = require('nemo-mocha-factory'),
  plugins = require('./plugins'),
  path = require('path'),
  util = require(path.resolve(__dirname, 'util')),
  nemo = {},
  setup = {};
plugins.plugins.login = {
  'module': path.resolve(__dirname, 'plugin/shared-fn-plugin'),
  'register': true
};

describe('nemo-view @pluginContainedFunctionality@', function () {
  nemoFactory({'context': nemo, 'plugins': plugins, 'setup': setup});
  beforeEach(function (done) {
    nemo.driver.get(nemo.props.targetBaseUrl + '/login');
    util.waitForJSReady(nemo).then(util.doneSuccess(done), util.doneError(done));
  });

  it('should complete the shared functionality', function (done) {
    nemo.login.login('medelman-buyer@paypal.com', '11111111');
    nemo.login.logout().then(util.doneSuccess(done), util.doneError(done));
  });

});