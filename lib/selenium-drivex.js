'use strict';

var debug = require("debug");
var log = debug("selenium-drivex");
var assert = require('chai').assert

module.exports = function drivex(driver, wd) {
    var methods = {
        find: function (locator, el, timeout) {
            function waitReturnElement(){
                return driver.wait(function(){
                    return (el ? el : driver).findElements(locator).then(function (elements) {
                        return elements[0]
                    })
                }, timeout || 5000, "[drivex.find] Element not found for locator " +
                showLocator(locator))
            }
            var wep = new wd.WebElementPromise(driver, waitReturnElement());
            return wep;
        },
        /**
         * wraps Selenium WebDriver/WebElement.findElements
         * @param locator {LocatorJSON}
         * @param el {WebElement}
         * @returns {Promise} resolves to an array of WebElements or []
         */
        finds: function (locator, el) {
            return (el ? el : driver).findElements(locator);
        },
        /**
         * wraps Selenium WebDriver/WebElement.isElementPresent
         * @param locator {LocatorJSON}
         * @param el {WebElement}
         * @returns {Promise} resolves to true or rejected
         */
        present: function (locator, el) {
            return (el ? el : driver).findElements(locator).then(eles => {
                return eles.length > 0
            });
        },
        /**
         * wraps Selenium WebElement.isVisible
         * @param locator {LocatorJSON}
         * @param el {WebElement}
         * @returns {Promise} resolves to true or rejected
         */
        visible: function (locator, el) {
            return methods.finds(locator, el).then(async function (eles) {
                return eles.length>0 && await eles[0].isDisplayed().catch(err => {return false});
            });
        },

         /**
         * wraps Selenium WebElement.isEnabled
         * @param locator {LocatorJSON}
         * @param el {WebElement}
         * @returns {Promise} resolves to true or rejected
         */
        enabled: function (locator, el) {
            return methods.find(locator, el).then(function (elt) {
                return elt.isEnabled();
            });
        },

         /**
         * wraps Selenium WebElement.isSelected
         * @param locator {LocatorJSON}
         * @param el {WebElement}
         * @returns {Promise} resolves to true or rejected
         */
        selected: function (locator, el) {
            return methods.find(locator, el).then(function (elt) {
                return elt.isSelected();
            });
        },

        /**
         * wraps function of mouseover
         * @param locator {LocatorJSON}
         * @param el {WebElement}
         * @returns {Promise} resolved or rejected
         */
        mouseover: function (locator, el) {
            return methods.find(locator, el).then(function (elt) {
                return driver.actions().move({origin: elt}).perform();
            });
        },

        /**
         * wraps function of scrollIntoView
         * @param locator {LocatorJSON}
         * @param el {WebElement}
         * @returns {Promise} resolved or rejected
         */
        scrollIntoView: function (locator, el) {
            return methods.find(locator, el).then(function (elt) {
                return driver.executeScript(`arguments[0].scrollIntoView(true)`, elt);
            });
        },

        /**
         * wraps Selenium WebElement.isSelected
         * @param locator {LocatorJSON}
         * @param el {WebElement}
         * @returns {Promise} resolved or rejected
         */
        click: function (locator, el) {
            return methods.find(locator, el).then(async function (elt) {
                await driver.wait(wd.until.elementIsVisible(elt), 5000, "element should be visible to be clicked");
                //delay
                await driver.sleep(1000)
                return elt.click()
            })
        },

        /**
         * wraps function of jsClick, may used by scenarios that doesn't work with click
         * @param locator {LocatorJSON}
         * @param el {WebElement}
         * @returns {Promise} resolved or rejected
         */
        jsClick: function (locator, el) {
            return methods.find(locator, el).then(async function (elt) {
                return driver.executeScript("arguments[0].click();", elt)
            })
        },

        /**
         * wraps function of sendkeys
         * @param locator {LocatorJSON}
         * @param el {WebElement}
         * @returns {Promise} resolved or rejected
         */
        fill: function (locator, el, value) {
            return methods.find(locator, el).then(async function (elt) {
                await driver.wait(wd.until.elementIsVisible(elt), 5000, "element should be visible while set values");
                return elt.sendKeys(value);
            })
        },

        /**
         * wraps function of uploadFile
         * @param locator {LocatorJSON}
         * @param el {WebElement}
         * @returns {Promise} resolved or rejected
         */
        uploadFile: function (locator, el, filePath) {
            return methods.find(locator, el).then(async function (elt) {
                await elt.getTagName().then(tag => {
                    assert.equal(tag.toLowerCase(),"input", "upload should only work for input[type=file]")
                })
                await elt.getAttribute("type").then(tag => {
                    assert.equal(tag.toLowerCase(),"file", "upload should only work for input[type=file]")
                })
                if(!await elt.isDisplayed()){
                    await driver.executeScript("arguments[0].style.visibility='‌​visible';arguments[0].style.display='block';", elt)
                }
                return elt.sendKeys(filePath);
            })
        },

        /**
         * wraps function of clear element
         * @param locator {LocatorJSON}
         * @param el {WebElement}
         * @returns {Promise} resolved or rejected
         */
        clear: function (locator, el) {
            return methods.find(locator, el).then(async function (elt) {
                await driver.wait(wd.until.elementIsVisible(elt), 5000, "element should be visible while set values");
                return elt.clear();
            })
        },


        /**
         * wraps function of sync for element, this will wait a locator to be visible and then invisible
         * @param locator {LocatorJSON}
         * @param el {WebElement}
         * @returns {Promise} resolved or rejected
         */
        sync: async function (locator, el, timeout = 15 * 1000) {
            let visible, waitTime = 0;
            while(visible && waitTime < timeout){
                //wait for visible
                await driver.wait(function() {
                    return methods.finds(locator, el).then(async function(eles){
                        return eles.length > 0 && await eles[0].isDisplayed().catch(() => {return false});
                    })
                }, 2000).catch(err => log(`wait for element visible fail: ${locator}`));
                await driver.sleep(500);
                //wait for invisible
                await driver.wait(function() {
                    return methods.finds(locator, el).then(async function(eles){
                        return eles.length == 0 || !(await eles[0].isDisplayed().catch(() => {return false}));
                    });
                }, 2000).then(() => {visible = false;})
                .catch(err => log(`wait for element invisible fail: ${locator}`));
                waitTime += 2000;
            }
        },

        /**
         * Wait for timeout milliseconds for the WebElement to be present
         * @param locator {LocatorJSON}
         * @param timeout {Number}
         * @param msg {String} optional message for any error messages
         * @returns {Promise} resolves to true or throw error
         */
        waitForElement: function (locator, timeout, msg) {
            log("waitForElement", locator);
            return driver.wait(function(){
                return driver.findElements(locator).then(function (elements) {
                    return elements[0]
                  })
            }, timeout, msg || "[drivex.find] Element not found for locator " +
            showLocator(locator))
        },
        /**
         * Wait for timeout milliseconds for the WebElement to be present
         * @param locator {LocatorJSON}
         * @param timeout {Number}
         * @param msg {String} optional message for any error messages
         * @returns {WebElementPromise} resolves to WebElement or throw error
         */
        waitForElementPromise: function (locator, timeout, msg) {
            function waitReturnElement() {
                return methods.waitForElement(locator, timeout || 5000, msg);
            }

            var wep = new wd.WebElementPromise(driver, waitReturnElement());
            return wep;
        },
        /**
         * Wait for timeout milliseconds for the WebElement to be visible
         * @param locator {LocatorJSON}
         * @param timeout {Number}
         * @param msg {String} optional message for any error messages
         * @returns {Promise} resolves to true or throw error
         */
        waitForElementVisible: function (locator, timeout, msg) {
            log("waitForElementVisible", locator);

            return methods.waitForElement(locator, timeout, msg).then(ele => {
                return driver.wait(wd.until.elementIsVisible(ele), timeout);
            }).then(
                function (isVisible) {
                    log("waitForElementVisible: " + isVisible, locator);
                    return methods.find(locator);
                },
                function (err) {
                    log("waitForElementVisible", err);
                    log(err.stack);
                    throw new Error(
                        msg ||
                        "[drivex.waitForElementVisible] Element not visible: " +
                        showLocator(locator)
                    );
                }
            );
        },
        /**
         * Wait for timeout milliseconds for the WebElement to be visible
         * @param locator {LocatorJSON}
         * @param timeout {Number}
         * @param msg {String} optional message for any error messages
         * @returns {WebElementPromise} resolves to WebElement or throw error
         */
        waitForElementVisiblePromise: function (locator, timeout, msg) {
            function waitVisibleReturnElement() {
                return methods.waitForElementVisible(locator, timeout || 5000, msg);
            }
            
            var wep = new wd.WebElementPromise(driver, waitVisibleReturnElement());
            return wep;
        },
        /**
         *
         * @param locator MUST resolve to a SELECT element
         * @param optionText option text to select
         * @param parentWebElement (optional)
         * @returns {Promise} resolves to a WebElement.click() (which resolves itself to a Promise
         */
        selectByOptionText: function (locator, optionText, parentWebElement) {
            return methods.find(locator, parentWebElement).then(
                 function (selectEl) {
                    return selectEl
                        .findElement(wd.By.xpath(".//option[text()='" + optionText + "']"))
                        .then(
                            function (element) {
                                return element.click();
                            },
                            function (err) {
                                throw new Error(err);
                            }
                        );
                },
                function (err) {
                    throw new Error(err);
                }
            );
        },
        /**
         *
         * @param locator MUST resolve to a SELECT element
         * @param optionValue option attribute value to select
         * @param parentWebElement (optional)
         * @returns {Promise} resolves to a WebElement.click() (which resolves itself to a Promise
         */
        selectByOptionValue:  function (
            locator,
            optionValue,
            parentWebElement
        ) {
            return methods.find(locator, parentWebElement).then(
                 function (selectEl) {
                    return selectEl
                        .findElement(wd.By.css("option[value='" + optionValue + "']"))
                        .then(
                             function (element) {
                                return element.click();
                            },
                            function (err) {
                                throw new Error(err);
                            }
                        );
                },
                function (err) {
                    throw new Error(err);
                }
            );
        },
        /**
         *
         * @param locatorObject {'key1': LocatorObj, 'key2': LocatorObj, ...}
         * @param timeout (optional)
         * @returns {*}
         */
        firstVisible: function (locatorObject, timeout) {
            var keyFound;
            var elementTests = [];
            Object.keys(locatorObject).forEach(function (key) {
                var loc = locatorObject[key];
                elementTests.push(function () {
                    return methods.waitForElementVisible(loc, 100).then(
                        function () {
                            keyFound = key;
                            return true;
                        },
                        function (err) {
                            return false;
                        }
                    );
                });
            });
            return driver
                .wait(function () {
                    var elementTest = elementTests.shift();
                    elementTests.push(elementTest);
                    return elementTest();
                }, timeout || 5000)
                .then(function () {
                    return keyFound;
                });
        },

        /**
         * Wait for timeout milliseconds for the WebElement Text
         * @param locator {LocatorJSON}
         * @param timeout {Number}
         * @param expected {expected text}
         * @param msg {String} optional message for any error messages
         * @returns {WebElementPromise} resolves to WebElement or throw error
         */
        waitForText: async function (locator, timeout, expected, msg) {

            await methods.waitForElement(locator, timeout, msg).then(async ele => {
                try{
                    await driver.wait(async function() {
                        return comparator(await ele.getText(), expected);
                    }, timeout);
                    return ele;
                }
                catch(err){
                    doAssert(await ele.getText(), expected, msg);
                }
            })
        },

        /**
         * Wait for timeout milliseconds for the WebElement Attribute
         * @param locator {LocatorJSON}
         * @param timeout {Number}
         * @param expected {expected result of Attribute}
         * @param msg {String} optional message for any error messages
         * @returns {WebElementPromise} resolves to WebElement or throw error
         */
        waitForAttribute: async function (locator, timeout, expected, msg) {
            let attribute = Object.keys(expected)[0]
            await methods.waitForElement(locator, timeout, msg).then(async ele => {
                try{
                    await driver.wait(async function() {
                        return comparator(await ele.getAttribute(attribute), expected[attribute]);
                    }, timeout);
                    return ele;
                }
                catch(err){
                    doAssert(await ele.getAttribute(attribute), expected[attribute], msg + attribute);
                }
            })
        },

        /**
         * Wait for timeout milliseconds for the WebElement CssValue
         * @param locator {LocatorJSON}
         * @param timeout {Number}
         * @param expected {expected result of CssValue}
         * @param msg {String} optional message for any error messages
         * @returns {WebElementPromise} resolves to WebElement or throw error
         */
        waitForCssValue: async function (locator, timeout, expected, msg) {
            let css = Object.keys(expected)[0]
            await methods.waitForElement(locator, timeout || 5000, msg).then(async ele => {
                try{
                    await driver.wait(async function(){
                        return comparator(await ele.getCssValue(css), expected[css]);
                    }, timeout);
                    return ele;
                }
                catch(err){
                    doAssert(await ele.getCssValue(css), expected[css], msg + css);
                }
            })
        },
        /**
         * Wait for timeout milliseconds for the WebElement of certain Conditions(visible, invisible, enabled, disabled, selected ...etc.)
         * @param locator {LocatorJSON}
         * @param timeout {Number}
         * @param expected {expected result of CssValue}
         * @param msg {String} optional message for any error messages
         * @returns {WebElementPromise} resolves to WebElement or throw error
         */
        waitFor: async function (locator, timeout, expected, msg) {

            if(["invisible","notVisible"].includes(expected)){
                await driver.wait(async function() {
                    const elements = await methods.finds(locator);
                    return (elements.length == 0 || !(await elements[0].isDisplayed()));
                }, timeout, msg + expected)
            }
            else{
                await methods.waitForElement(locator, timeout, msg).then(async ele => {
                    await waitForCondition(driver, wd, ele, timeout, expected, msg);
                    return ele;
                })
            }
        },



        is: async function (locator, parentWebElement, expected, msg) {
            if(["invisible","notVisible"].includes(expected)){
                return await methods
                .finds(locator,parentWebElement)
                .then(async function(eles){
                    if(eles.length > 0 && (await eles[0].isDisplayed())){
                        throw new Error(`check ${expected} failed for locator: ${showLocator(locator)}`);
                    }
                    return true;
                });
            }
            return await methods
            .find(locator, parentWebElement).then(async ele => {
                await checkElementState(ele, expected, msg);
                return true;
            });
        },

        assertSelectedText: async function (locator, parentWebElement, expected, msg) {
            await methods
            .find(locator, parentWebElement).then(function (selectEl) {
                selectEl.findElements(wd.By.css('option')).then(async function (elts) {
                    for(let option of elts){
                        if(await option.isSelected()){
                            return option.getText();
                        }
                    }
                })
            }).then(actual => {
                doAssert(actual, expected, msg);
            });
        },

        /**
         *assertText validates the text for a WebElement
         * @param locator
         * @param parentWebElement (optional)
         * @param expected text of the WebElement
         * @param msg message for error info
         * @returns {WebElementPromise} resolves to true or throw error
         */
        assertText: async function (locator, parentWebElement, expected, msg) {
            await methods
            .find(locator, parentWebElement)
            .getText().then(actual => {
                doAssert(actual, expected, msg);
            });
        },

        /**
         *assertValue validates the value for a WebElement
         * @param locator
         * @param parentWebElement (optional)
         * @param expected value of the WebElement
         * @param msg message for error info
         * @returns {WebElementPromise} resolves to true or throw error
         */
        assertValue: async function (locator, parentWebElement, expected, msg) {
            await methods
            .find(locator, parentWebElement)
            .getAttribute("value").then(actual => {
                doAssert(actual, expected, msg);

            });
        },

        /**
         *assertAttribute validates the attribute for a WebElement
         * @param locator
         * @param parentWebElement (optional)
         * @param expected attribute of the WebElement
         * @param msg message for error info
         * @returns {WebElementPromise} resolves to true or throw error
         */
        assertAttribute: async function (locator, parentWebElement, expected, msg) {
            for(let key of Object.keys(expected)){
                await methods
                .find(locator, parentWebElement)
                .getAttribute(key).then(function (actual) {
                    doAssert(actual, expected[key], msg + key);
                });
            }
        },

        /**
         *assertCssValue validates the cssValue for a WebElement
         * @param locator
         * @param parentWebElement (optional)
         * @param expected css value of the WebElement
         * @param msg message for error info
         * @returns {WebElementPromise} resolves to true or throw error
         */
        assertCssValue: async function (locator, parentWebElement, expected, msg) {
            for(let key of Object.keys(expected)){
                await methods
                .find(locator, parentWebElement)
                .getCssValue(key).then(function (actual) {
                    doAssert(actual, expected[key], msg + key);
                });
            }
        },
        
        /**
         *validateText validates the text for a WebElement
         * @param locator
         * @param parentWebElement (optional)
         * @param expected text
         * @returns {WebElementPromise} resolves to true or throw error
         */
        validateText: function (locator, parentWebElement, expectedText) {
            return methods
            .find(locator, parentWebElement)
            .getText().then(actual => {
                doAssert(actual, expectedText);
            })
        },
        /**
         *validateAttributeValue validates the attribute for a WebElement
         * @param locator
         * @param parentWebElement (optional)
         * @param attribute value
         * @param expected text
         * @returns {WebElementPromise} resolves to true or throw error
         */
        validateAttributeValue: function (
            locator,
            parentWebElement,
            attribute,
            expectedText
        ) {
            return methods
            .find(locator, parentWebElement)
            .getAttribute(attribute).then(function (actual) {
                doAssert(actual, expectedText);
            })
        },
    };

    return methods;
};

function showLocator(locator) {
    if (locator instanceof Function) {
        return "[Function]";
    } else {
        return JSON.stringify(locator);
    }
}

async function checkElementState(ele, expectedStatus, msg){

    switch (expectedStatus) {
        case "visible":
            assert.isTrue(await ele.isDisplayed(), msg + expectedStatus);
            break;
        case "enabled": case "editable": case "clickable": 
            assert.isTrue(await ele.isEnabled(), msg + expectedStatus);
            break;
        case "disabled": case "notEditable": 
            assert.isTrue(!(await ele.isEnabled()), msg + expectedStatus);
            break;
        case "selected": case "checked": 
            assert.isTrue(await ele.isSelected(), msg + expectedStatus);
            break;   
        case "notSelected": case "notChecked":  case "unchecked": case "unselected": 
            assert.isTrue(!(await ele.isSelected()), msg + expectedStatus);
            break;  
        default:
            throw new TypeError(`expected type: ${expectedStatus} is not valid`);
    }
}


async function waitForCondition(driver, wd, ele, timeout, expectedStatus, msg){

    switch (expectedStatus) {
        case "visible":
            await driver.wait(wd.until.elementIsVisible(ele), timeout, msg + expectedStatus);
            break;
        case "enabled": case "editable": 
            await driver.wait(wd.until.elementIsEnabled(ele), timeout, msg + expectedStatus);
            break;
        case "disabled": case "notEditable": 
            await driver.wait(wd.until.elementIsDisabled(ele), timeout, msg + expectedStatus);
            break;
        case "selected": case "checked": 
            await driver.wait(wd.until.elementIsSelected(ele), timeout, msg + expectedStatus);
            break;   
        case "notSelected": case "notChecked":  case "unchecked": case "unselected": 
            await driver.wait(wd.until.elementIsNotSelected(ele), timeout, msg + expectedStatus);
            break;  
        default:
            throw new TypeError(`expected type: ${expectedStatus} is not valid`);
    }
}

function doAssert(actual, expected, msg){

    let comparator = "equal", value = "";
    if(typeof expected != 'object') {
        comparator = "equal";
        value = expected;
    }
    else{
        let keys = Object.keys(expected);
        comparator = keys[0];
        value = expected[keys[0]];
    }
    switch (comparator) {
        case "equal": case "==":
            assert.equal(actual, value, msg);
            break;
        case "notEqual": case "!=":
            assert.notEqual(actual, value, msg);
            break;
        case "contain": case "have": case "include": case "*=":
            assert.include(actual, value, msg);
            break;
        case "notContain": case "notHave": case "notInclude":
            assert.notInclude(actual, value, msg);
            break;
        case "match": case "~=":
            assert.match(actual, value, msg);
            break;
        case "notMatch":
            assert.notMatch(actual, value, msg);
            break;
        case "greaterThan": case "moreThan": case ">":
            assert.isAbove(Number(actual), Number(value), msg);
            break;
        case "lessThan": case "<":
            assert.isBelow(Number(actual), Number(value), msg);
            break; 
        case "noMoreThan": case "<=":
            assert.isAtMost(Number(actual), Number(value), msg);
            break; 
        case "noLessThan": case ">=":
            assert.isAtLeast(Number(actual), Number(value), msg);
            break;                  
        default:
            throw new TypeError(`expected comparator: ${comparator} is not valid`);
    }
}

function comparator(actual, expected){
    let comparator = "equal", value = "", result = false;
    if(typeof expected != 'object') {
        comparator = "equal";
        value = expected;
    }
    else{
        let keys = Object.keys(expected);
        comparator = keys[0];
        value = expected[keys[0]];
    }
    switch (comparator) {
        case "equal": case "==":
            result = actual == value;
            break;
        case "notEqual": case "!=":
            result = actual != value;
            break;
        case "contain": case "have": case "include": case "*=":
            result = actual.includes(value);
            break;
        case "notContain": case "notHave": case "notInclude":
            result = !actual.includes(value);
            break;
        case "match": case "~=":
            result = actual.match(value);
            break;
        case "notMatch":
            result = !actual.match(value);
            break;
        case "greaterThan": case "moreThan": case ">":
            result = Number(actual) > Number(value);
            break;
        case "lessThan": case "<":
            result = Number(actual) < Number(value);
            break; 
        case "noMoreThan": case "<=":
            result = Number(actual) <= Number(value);
            break; 
        case "noLessThan": case ">=":
            result = Number(actual) >= Number(value);
            break;                  
        default:
            throw new TypeError(`expected comparator: ${comparator} is not valid`);
    }
    return result;
}
