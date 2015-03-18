/* global describe,it */
'use strict';

var assert = require('assert'),
  Nemo = require('nemo'),
  nemo = {},
  setup = {
    'view': [
      {
        'name': 'login',
        'locator': 'module:nemo-shared-objects/login'
      }
    ]
  };

//describe('nemo-view @moduleViewSuite@', function () {
//  nemoFactory({'context': nemo, 'plugins': plugins, 'setup': setup});
//  it('should find the PayPal login email locator', function (done) {
//    var emailLocator = nemo.view.login.emailBy();
//    assert.deepEqual(emailLocator, {'using': 'id', 'value': 'login_email'});
//    done();
//  });
//
//});