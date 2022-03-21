/* global before,after,describe,beforeEach,it */
'use strict';

var Nemo = require('nemo-core'),
  nemo = {},
  path = require('path'),
  assert = require('assert'),
  util = require(path.resolve(__dirname, 'util'));

describe('nemo-view @select@', async function () {
  before(async function() {
    nemo = await Nemo();
  });

  after(async function() {
    await nemo.driver.quit();
  });

  beforeEach(async function() {
    await nemo.driver.get(nemo.data.baseUrl + '/selects');
    await util.waitForJSReady(nemo);
  });

  it('should select option by @OptionValue@positive@ method', async function() {
    await nemo.view.select.selectOptionValue('2');
    await nemo.view.select.select().getAttribute('value').then(function (value) {
      assert.equal(value,'2');
    });
  });

  it('should NOT select option by @OptionValue@negative@ method', async function() {
    let err;
    try {
      await nemo.view.select.selectOptionValue('does not exist')
    } catch (error) {
      err = error
    } finally { 
      assert(err);
    }
  });

  it('should select option by @OptionText@positive@ method', async function() {
    await nemo.view.select.selectOptionText('Value of 2');
    await nemo.view.select.select().getAttribute('value').then(async function (value) {
      assert.equal(value,'2');
    })
  });

  it('should NOT select option by @OptionText@negative@ method', async function() {
    let err;
    try {
      await nemo.view.select.selectOptionText('does not exist')
    } catch (error) {
      err = error
    } finally { 
      assert(err);
    }
  });

  it('should select option by @_optionValue@positive@ method', async function() {
    await nemo.view._optionValue('#selectWithValues', 2);
    await nemo.view._find('#selectWithValues').getAttribute('value').then(async function (value) {
      assert.equal(value, '2');
    })
  });

  it('should select option by @_optionValue@withParent@positive method', async function() {
    await nemo.view._optionValue('#selectWithValues', 2, await nemo.view.select.selectParent());
    await nemo.view._find('#selectWithValues').getAttribute('value').then(async function (value) {
      assert.equal(value, '2');
    })
  });

  it('should NOT select option by @_optionValue@negative@ method', async function() {
    let err;
    try {
      await nemo.view._optionValue('#selectWithValues', 'does not exist')
    } catch (error) {
      err = error
    } finally { 
      assert(err);
    }
  });

  it('should NOT select option by @_optionValue@withParent@negative method', async function() {
    let err;
    try {
      await nemo.view._optionValue('#selectWithValues', 'does not exist', await nemo.view.select.selectParent())
    } catch (error) {
      err = error
    } finally { 
      assert(err);
    }
  });

  it('should select option by  @_optionText@positive@ method', async function() {
    await nemo.view._optionText('#selectWithValues', 'Value of 2');
    await nemo.view._find('#selectWithValues').getAttribute('value').then(async function (value) {
      assert.equal(value, '2');
    })
  });

  it('should select option by @_optionText@withParent@positive method', async function() {
    await nemo.view._optionText('#selectWithValues', 'Value of 2', await nemo.view.select.selectParent());
    await nemo.view._find('#selectWithValues').getAttribute('value').then(async function (value) {
      assert.equal(value, '2');
    })
  });

  it('should NOT select option by @_optionText@negative@ method', async function() {
    let err;
    try {
      await nemo.view._optionText('#selectWithValues', 'does not exist');
    } catch (error) {
      err = error
    } finally { 
      assert(err);
    }
  });

  it('should NOT select option by @_optionText@withParent@negative method', async function() {
    let err;
    try {
      await nemo.view._optionText('#selectWithValues', 'does not exist', await nemo.view.select.selectParent())
    } catch (error) {
      err = error
    } finally { 
      assert(err);
    }
  });
});
