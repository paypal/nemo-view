/* global describe,before,after,beforeEach,it */
'use strict';

const assert = require('assert');

var Nemo = require('nemo-core'),
  path = require('path'),
  util = require(path.resolve(__dirname, 'util')),
  nemo = {};

describe('nemo-view @newMethods-negative@', function () {
  before(async function() {
    nemo = await Nemo();
  });

  after(async function() {
    await nemo.driver.quit();
  });

  beforeEach(async function() {
    //await nemo.driver.get("http://localhost:9090/");
    await nemo.driver.get(nemo.data.baseUrl);
    await util.waitForJSReady(nemo);
  });

  it('should waitFor invisible failed', async function () {
    const {form} = nemo.view
    await assert.rejects(
      async () => {
        await form.fooText.waitFor("invisible", 3000);
      },
      {
        name: 'TimeoutError'
      }
    );
  });

  it('should waitFor disabled failed', async function () {
    const {form} = nemo.view
    await assert.rejects(
      async () => {
        await form.fooButton.waitFor("disabled", 3000);
      },
      {
        name: 'TimeoutError'
      }
    );
  });

  it('should waitForText equal failed', async function () {
    const {form} = nemo.view
    await assert.rejects(
      async () => {
        await form.fooLabel.waitForText("foo Text", 1000)
      },
      {
        name: 'AssertionError'
      }
    );
  });

  it('should waitForText contain failed', async function () {
    const {form} = nemo.view
    await assert.rejects(
      async () => {
        await form.fooLabel.waitForText({"contain":"not exist"}, 1000)
      },
      {
        name: "AssertionError",
        message: "Wait for element text for [fooLabel] : expected 'foo Text:' to include 'not exist'"
      }
    );
  });

  it('should waitForText match failed', async function () {
    const {form} = nemo.view
    await assert.rejects(
      async () => {
        await form.fooLabel.waitForText({"match": /notExist/}, 1000)
      },
      {
        name: "AssertionError",
        message: "Wait for element text for [fooLabel] : expected 'foo Text:' to match /notExist/"
      }
    );
  });


  it('should find the element within a wrong parentElement failed', async function () {
    const {form} = nemo.view
    await nemo.view.within(await form.barParent(), async () => {
      await assert.rejects(
        async () => await form.fooLabel(),
        {
          name: "TimeoutError"
        }
      );
    })
  });

});
