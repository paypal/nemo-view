'use strict';
const Drivex = require('./selenium-drivex');
const Locatex = require('./locatex');
const _ = require('lodash');
const normalize = require('./normalize');
const debug = require('debug');
const log = debug('nemo-view:log');

class Locreator {

    constructor(nemo) {
        log('creating Locreator instance');
        this.nemo = nemo;
        this.parentElement
        this.drivex = Drivex(nemo.driver, nemo.wd);
        this.locatex = Locatex(nemo);
        this.normify = this.normalize =  (locator) => normalize(nemo, locator);
    }
    addGenericMethods() {
        log('adding generic methods');
        const normify = this.normify;
        const drivex = this.drivex;
        let nemo = this.nemo;

        nemo.view.within = async (parentElement, asyncFn) => {
            this.parentElement = parentElement
            await asyncFn()
            this.parentElement = undefined
        }

        nemo.view._find = (locator, parentElement) => drivex.find(normify(locator), this.parentElement || parentElement);

        nemo.view._finds = (locator, parentElement) => drivex.finds(normify(locator), this.parentElement || parentElement);

        nemo.view._present = (locator, parentElement) => drivex.present(normify(locator), this.parentElement || parentElement);

        nemo.view._visible = (locator, parentElement) => drivex.visible(normify(locator), this.parentElement || parentElement);

        nemo.view._wait = (locator, timeout, msg) => drivex.waitForElementPromise(normify(locator), timeout, msg);

        nemo.view._waitVisible = (locator, timeout, msg) => drivex.waitForElementVisiblePromise(normify(locator), timeout || 5000, msg);

        nemo.view._optionText =  (locator, optionText, parentElement) =>  drivex.selectByOptionText(normify(locator), optionText, this.parentElement || parentElement);

        nemo.view._optionValue =  (locator, optionValue, parentElement) => drivex.selectByOptionValue(normify(locator), optionValue, this.parentElement || parentElement);

        nemo.view._firstVisible = (_locatorObject, timeout) => {
            //transform _locatorObject to use native selenium-webdriver Locator format
            const locatorObject = _.transform(_locatorObject, function (result, n, key) {
                result[key] = normify(_locatorObject[key]);
            });
            return drivex.firstVisible(locatorObject, timeout);
        };
    }
    addStarMethods(locatorId, locatorJSON, parentWebElement) {
        log('add star methods for %s', locatorId);
        let locatorObject = {};
        const drivex = this.drivex;
        let locreator = this;
        const locator =  () => locreator.normify(locreator.locatex(locatorJSON));

        //this is an error check. if an error thrown, invalid locatorJSON.
        locator();

        locatorObject[locatorId] = () => drivex.find(locator(), this.parentElement || parentWebElement);

        locatorObject[locatorId + 'By'] = locatorObject[locatorId].by = () => locator();

        locatorObject[locatorId + 'Present'] = locatorObject[locatorId].present = () => drivex.present(locator(), this.parentElement || parentWebElement);

        locatorObject[locatorId + 'Wait'] = locatorObject[locatorId].wait = (timeout, msg) => drivex.waitForElementPromise(locator(), timeout || 5000, msg || 'Wait failed for locator [' + locatorId + ']');

        locatorObject[locatorId + 'WaitVisible'] = locatorObject[locatorId].waitVisible = (timeout, msg) => drivex.waitForElementVisiblePromise(locator(), timeout || 5000, msg || 'WaitVisible failed for locator [' + locatorId + ']');

        locatorObject[locatorId + 'Visible'] = locatorObject[locatorId].visible = () => drivex.visible(locator(), this.parentElement || parentWebElement);

        locatorObject[locatorId + 'Enabled'] = locatorObject[locatorId].enabled = () => drivex.enabled(locator(), this.parentElement || parentWebElement);

        locatorObject[locatorId + 'Selected'] = locatorObject[locatorId].selected = () => drivex.selected(locator(), this.parentElement || parentWebElement);

        locatorObject[locatorId + 'OptionText'] = locatorObject[locatorId].optionText = (optionText) => drivex.selectByOptionText(locator(), optionText, this.parentElement || parentWebElement);

        locatorObject[locatorId + 'OptionValue'] = locatorObject[locatorId].optionValue = (optionValue) => drivex.selectByOptionValue(locator(), optionValue, this.parentElement || parentWebElement);

        locatorObject[locatorId + 'TextEquals'] = locatorObject[locatorId].textEquals = (value) => drivex.validateText(locator(), this.parentElement || parentWebElement, value);

        locatorObject[locatorId + 'AttrEquals'] = locatorObject[locatorId].attrEquals = (attribute, value) => drivex.validateAttributeValue(locator(), this.parentElement || parentWebElement, attribute, value);

        locatorObject[locatorId + 'AssertText'] = locatorObject[locatorId].assertText = (value) => drivex.assertText(locator(), this.parentElement || parentWebElement, value, `Check element text for [${locatorId}] `);

        locatorObject[locatorId + 'AssertValue'] = locatorObject[locatorId].assertValue = (value) => drivex.assertValue(locator(), this.parentElement || parentWebElement, value, `Check element value for [${locatorId}] `);

        locatorObject[locatorId + 'AssertAttribute'] = locatorObject[locatorId].assertAttribute = (value) => drivex.assertAttribute(locator(), this.parentElement || parentWebElement, value, `Check attribute for [${locatorId}] of `);

        locatorObject[locatorId + 'AssertCssValue'] = locatorObject[locatorId].assertCssValue = (value) => drivex.assertCssValue(locator(), this.parentElement || parentWebElement, value, `Check css value for [${locatorId}] of `);
        
        locatorObject[locatorId].click = () => drivex.click(locator(), this.parentElement || parentWebElement);

        locatorObject[locatorId].jsClick = () => drivex.jsClick(locator(), this.parentElement || parentWebElement);

        locatorObject[locatorId].fill = (value) => drivex.fill(locator(), this.parentElement || parentWebElement, value);

        locatorObject[locatorId].uploadFile = (value) => drivex.uploadFile(locator(), this.parentElement || parentWebElement, value);

        locatorObject[locatorId].clear = () => drivex.clear(locator(), this.parentElement || parentWebElement);

        locatorObject[locatorId].mouseover = () => drivex.mouseover(locator(), this.parentElement || parentWebElement);

        locatorObject[locatorId].scrollIntoView = () => drivex.scrollIntoView(locator(), this.parentElement || parentWebElement);

        locatorObject[locatorId].sync = () => drivex.sync(locator(), this.parentElement || parentWebElement);

        locatorObject[locatorId].is = (value) => drivex.is(locator(), this.parentElement || parentWebElement, value, `Check [${locatorId}] is `);

        locatorObject[locatorId].waitFor = (value, timeout) => drivex.waitFor(locator(), timeout || 5000, value, `Wait for element [${locatorId}] to be: `);

        locatorObject[locatorId].waitForText = (value, timeout) => drivex.waitForText(locator(), timeout || 5000, value, `Wait for element text for [${locatorId}] `);

        locatorObject[locatorId].waitForAttribute = (value, timeout) => drivex.waitForAttribute(locator(), timeout || 5000, value, `Wait for Attribute for [${locatorId}] of `);

        locatorObject[locatorId].waitForCssValue = (value, timeout) => drivex.waitForCssValue(locator(), timeout || 5000, value, `Wait for CssValue for [${locatorId}] of `);

        locatorObject[locatorId + 'AssertSelectedText'] = locatorObject[locatorId].assertSelectedText = (value) => drivex.assertSelectedText(locator(), parentWebElement, value, `Check element selected text for [${locatorId}] ` );

        return locatorObject;
    }
    addGroup(locatorJSON) {
        const nemo = this.nemo;
        const drivex = this.drivex;
        let locreator = this;
        return () => { //give back the nemo.view.viewname.list() function
            const localizedJSON = locreator.locatex(locatorJSON);
            return drivex.finds(locreator.normify(localizedJSON)).then((parentWebElements) => {
                return nemo.wd.promise.map(parentWebElements, (parentWebElement) => {
                    let parentObject = {};
                    Object.keys(localizedJSON.Elements).forEach((childLocatorId) => {
                        const childLocatorJSON = localizedJSON.Elements[childLocatorId];
                        const starMethods = locreator.addStarMethods(childLocatorId, childLocatorJSON, parentWebElement);
                        _.merge(parentObject, starMethods);
                    });
                    return parentObject;
                });
            });
        };
    }
}
module.exports = Locreator;
