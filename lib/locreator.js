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
        this.drivex = Drivex(nemo.driver, nemo.wd);
        this.locatex = Locatex(nemo);
        this.normify = this.normalize =  (locator) => normalize(nemo, locator);
    }
    addGenericMethods() {
        log('adding generic methods');
        const normify = this.normify;
        const drivex = this.drivex;
        let nemo = this.nemo;

        nemo.view._find = (locator, parentElement) => drivex.find(normify(locator), parentElement);

        nemo.view._finds = (locator, parentElement) => drivex.finds(normify(locator), parentElement);

        nemo.view._present = (locator, parentElement) => drivex.present(normify(locator), parentElement);

        nemo.view._visible = (locator, parentElement) => drivex.visible(normify(locator), parentElement);

        nemo.view._wait = (locator, timeout, msg) => drivex.waitForElementPromise(normify(locator), timeout, msg);

        nemo.view._waitVisible = (locator, timeout, msg) => drivex.waitForElementVisiblePromise(normify(locator), timeout || 5000, msg);

        nemo.view._optionText =  (locator, optionText, parentElement) =>  drivex.selectByOptionText(normify(locator), optionText, parentElement);

        nemo.view._optionValue =  (locator, optionValue, parentElement) => drivex.selectByOptionValue(normify(locator), optionValue, parentElement);

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

        locatorObject[locatorId] = () => drivex.find(locator(), parentWebElement);

        locatorObject[locatorId + 'By'] = locatorObject[locatorId].by = () => locator();

        locatorObject[locatorId + 'Present'] = locatorObject[locatorId].present = () => drivex.present(locator(), parentWebElement);

        locatorObject[locatorId + 'Wait'] = locatorObject[locatorId].wait = (timeout, msg) => drivex.waitForElementPromise(locator(), timeout || 5000, msg || 'Wait failed for locator [' + locatorId + ']');

        locatorObject[locatorId + 'WaitVisible'] = locatorObject[locatorId].waitVisible = (timeout, msg) => drivex.waitForElementVisiblePromise(locator(), timeout || 5000, msg || 'WaitVisible failed for locator [' + locatorId + ']');

        locatorObject[locatorId + 'Visible'] = locatorObject[locatorId].visible = () => drivex.visible(locator(), parentWebElement);

        locatorObject[locatorId + 'OptionText'] = locatorObject[locatorId].optionText = (optionText) => drivex.selectByOptionText(locator(), optionText, parentWebElement);

        locatorObject[locatorId + 'OptionValue'] = locatorObject[locatorId].optionValue = (optionValue) => drivex.selectByOptionValue(locator(), optionValue, parentWebElement);

        locatorObject[locatorId + 'TextEquals'] = locatorObject[locatorId].textEquals = (value) => drivex.validateText(locator(), parentWebElement, value);

        locatorObject[locatorId + 'AttrEquals'] = locatorObject[locatorId].attrEquals = (attribute, value) => drivex.validateAttributeValue(locator(), parentWebElement, attribute, value);

        locatorObject[locatorId + 'AssertText'] = locatorObject[locatorId].assertText = (value) => drivex.assertText(locator(), parentWebElement, value, `Check element text for [${locatorId}] `);

        locatorObject[locatorId + 'AssertValue'] = locatorObject[locatorId].assertValue = (value) => drivex.assertValue(locator(), parentWebElement, value, `Check element value for [${locatorId}] `);

        locatorObject[locatorId + 'AssertAttribute'] = locatorObject[locatorId].assertAttribute = (value) => drivex.assertAttribute(locator(), parentWebElement, value, `Check attribute for [${locatorId}] of `);

        locatorObject[locatorId + 'AssertCssValue'] = locatorObject[locatorId].assertCssValue = (value) => drivex.assertCssValue(locator(), parentWebElement, value, `Check css value for [${locatorId}] of `);
        
        locatorObject[locatorId].mouseover = () => drivex.mouseover(locator(), parentWebElement);

        locatorObject[locatorId].scrollIntoView = () => drivex.scrollIntoView(locator(), parentWebElement);

        locatorObject[locatorId].is = (value) => drivex.is(locator(), parentWebElement, value, `Check [${locatorId}] is `);

        locatorObject[locatorId].waitFor = (value, timeout) => drivex.waitFor(locator(), timeout || 5000, value, `Wait for element text for [${locatorId}] `);

        locatorObject[locatorId].waitForText = (value, timeout) => drivex.waitForText(locator(), timeout || 5000, value, `Wait for element value for [${locatorId}] `);

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
