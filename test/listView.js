/* global describe,before,after,beforeEach,it */

'use strict';

const { assert } = require('console');

var path = require('path'),
  util = require(path.resolve(__dirname, 'util')),
  Nemo = require('nemo-core'),
  nemo = {};

describe('nemo-view @listViewSuite@', function () {

  before(async function() {
    nemo = await Nemo();
  });

  after(async function() {
    await nemo.driver.quit();
  });

  beforeEach(async function() {
    await nemo.driver.get(nemo.data.baseUrl);
    await util.waitForJSReady(nemo);
  });
  
  it('should use the form list view to enter values and write to outy div @useListView@', async function () {
    await nemo.view.formElementList.inputGroup().then(async function (elts) {
      for(let elt of elts) {
        await elt.text().sendKeys('abcd');
        await elt.button().click();
      }
      await nemo.view.formElementList.outBox().getText().then(function (outText) {
        assert(outText, 'abcdabcdabcdabcd', 'didnt get what we shoulda')
      });
    });

  });

});
