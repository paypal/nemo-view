/* global before,after,describe,it */

'use strict';

var Nemo = require('nemo-core'),
  path = require('path'),
  util = require(path.resolve(__dirname, 'util')),
  nemo = {};

describe('nemo-view @pluginContainedFunctionality@', function () {
  before(function(done) {
    nemo = Nemo(done);
  });
  after(function(done) {
    nemo.driver.quit().then(done);
  });
  it('should complete the shared functionality', function (done) {
    nemo.login.getPage();
    util.waitForJSReady(nemo);
    nemo.login.login('medelman-buyer@paypal.com', '11111111');
    nemo.login.logout().then(util.doneSuccess(done), util.doneError(done));
  });

});
