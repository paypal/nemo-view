/* global describe,before,after,beforeEach,it */
'use strict';

const assert = require('assert');

var Nemo = require('nemo-core'),
  path = require('path'),
  util = require(path.resolve(__dirname, 'util')),
  nemo = {};

describe('nemo-view @newMethods@', function () {
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

  it('should waitFor visible successfully', async function () {
    const {form} = nemo.view
    await form.fooText.waitFor("visible")
  });

  it('should waitFor enabled successfully', async function () {
    const {form} = nemo.view
    await form.fooButton.waitFor("enabled")
  });

  it('should waitForText equal successfully', async function () {
    const {form} = nemo.view
    await form.fooLabel.waitForText("foo Text:")
    await form.fooLabel.waitForText({"equal": "foo Text:"})
  });

  it('should waitForText notEqual successfully', async function () {
    const {form} = nemo.view
    await form.fooLabel.waitForText({"notEqual":"foo Text"})
    await form.fooLabel.waitForText({"!=":"foo Text"})
  });

  it('should waitForText contain successfully', async function () {
    const {form} = nemo.view
    await form.fooLabel.waitForText({"contain":"foo Text"})
    await form.fooLabel.waitForText({"include":"foo Text"})
    await form.fooLabel.waitForText({"have":"foo Text"})
    await form.fooLabel.waitForText({"*=":"foo Text"})
  });

  it('should waitForText notContain successfully', async function () {
    const {form} = nemo.view
    await form.fooLabel.waitForText({"notContain":"notExist"})
    await form.fooLabel.waitForText({"notInclude":"notExist"})
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

  it('should waitForText match successfully', async function () {
    const {form} = nemo.view
    await form.fooLabel.waitForText({"match":/foo Text/})
    await form.fooLabel.waitForText({"~=":/foo Text/})
  });
  it('should waitForText notMatch successfully', async function () {
    const {form} = nemo.view
    await form.fooLabel.waitForText({"notMatch":/notExist/})
  });

  it('should waitForAttribute equal successfully', async function () {
    const {form} = nemo.view
    await form.fooButton.waitForAttribute({
      "value": "Go foo"
    })
    await form.fooButton.waitForAttribute({
      "value":{"equal": "Go foo"}
    })
  });

  it('should waitForCssValue equal successfully', async function () {
    const {form} = nemo.view
    await form.fooButton.waitForCssValue({
      "color": "rgba(0, 0, 0, 1)"
    }, 10000)
    await form.fooButton.waitForCssValue({
      "color":{"equal": "rgba(0, 0, 0, 1)"}
    }, 1000)
  });

  it('should waitForCssValue font-family equal successfully', async function () {
    const {form} = nemo.view
    await form.fooButton.waitForCssValue({
      "font-family": "Arial"
    }, 1000)
    await form.fooButton.waitForCssValue({
      "font-family":{"equal": "Arial"}
    }, 1000)
  });

  it('should find the element within a parentElement successfully', async function () {
    const {form} = nemo.view
    await nemo.view.within(await form.fooParent(), async () => {
      let label = await form.fooLabel();
      assert.equal('foo Text:', await label.getText());
      let text = await form.fooLabel().getText(); 
      assert.equal('foo Text:', text);
    })
  });

  it('should assertText notMatch successfully', async function () {
    const {form} = nemo.view
    await form.fooLabel.assertText({"notMatch":/notExist/})
  });

  it('should mouseover successfully', async function () {
    const {form} = nemo.view
    await form.fooLabel.mouseover()
  });

  it('should scrollIntoView successfully', async function () {
    const {form} = nemo.view
    await form.fooLabel.scrollIntoView()
  });


  it('should click successfully', async function () {
    const {form} = nemo.view
    await form.fooText.fill('ggg');
    await form.fooButton.click();
    await form.outBox.waitForText("ggg")
  });

  it('should clear successfully', async function () {
    const {form} = nemo.view
    await form.fooText.fill('ggg');
    await form.fooText.assertAttribute({
      value: "ggg"
    })
    await form.fooText.clear()
    await form.fooText.assertAttribute({
      value: ""
    })
  });

});
