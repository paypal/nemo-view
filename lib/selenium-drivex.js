var debug = require("debug");
var log = debug("selenium-drivex");
var async = require("async");
var assert = require('chai').assert

module.exports = function drivex(driver, wd) {
    var methods = {
        find: function (locator, el) {
            return (el ? el : driver).findElement(locator);
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
            return (el ? el : driver).isElementPresent(locator);
        },
        /**
         * wraps Selenium WebElement.isVisible
         * @param locator {LocatorJSON}
         * @param el {WebElement}
         * @returns {Promise} resolves to true or rejected
         */
        visible: function (locator, el) {
            return methods.find(locator, el).then(function (elt) {
                return elt.isDisplayed();
            });
        },

        mouseover: function (locator, el) {
            return methods.find(locator, el).then(function (elt) {
                return driver.actions().mouseMove(elt).perform();
            });
        },

        scrollIntoView: function (locator, el) {
            return methods.find(locator, el).then(function (elt) {
                return driver.executeScript('arguments[0].scrollIntoView(true)', elt)
            });
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
            return driver.wait(wd.until.elementLocated(locator), timeout, msg).then(
                function () {
                    log("waitForElement: found", locator);
                    return methods.find(locator);
                },
                function (err) {
                    log("waitForElement", err);
                    log(err.stack);
                    throw new Error(
                        msg ||
                        "[drivex.waitForElement] Element not locatable for locator " +
                        showLocator(locator)
                    );
                }
            );
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
            return driver.wait(
                    wd.until.elementLocated(locator),
                    timeout,
                    msg
                )
                .then(function () {
                    driver.wait(
                        function () {
                            return methods.visible(locator);
                        },
                        timeout,
                        msg
                    );
                })
                .then(
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
         * @returns {Promise} resolves to a WebeElement.click() (which resolves itself to a Promise
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
         * @returns {Promise} resolves to a WebeElement.click() (which resolves itself to a Promise
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

        is: async function (locator, parentWebElement, expected) {

            if(["invisible","notVisible"].includes(expected)){
                await methods
                .finds(locator,parentWebElement)
                .then(async function(eles){
                    if(eles.length > 0 && (await eles[0].isDisplayed())){
                        throw new Error(`check ${expected} failed for locator: ${showLocator(locator)}`)
                    }
                })
            }
            await methods
            .find(locator, parentWebElement).then(async ele => {
                try{
                    await checkElementState(ele, expected)
                }
                catch(err){
                    throw new Error(err)
                }
            })
        },

        assertSelectedText: async function (locator, parentWebElement, expected) {
            await methods
            .find(locator, parentWebElement).then(function (selectEl) {
                selectEl.findElements(wd.By.css('option')).then(async function (elts) {
                    for(let option of elts){
                        if(await option.isSelected()){
                            return option.getText()
                        }
                    }
                })
            }).then(actual => {
                try{
                    doAssert(actual, expected)
                }
                catch(err){
                    throw new Error(err)
                }
            })
        },

        assertText: async function (locator, parentWebElement, expected) {
            await methods
            .find(locator, parentWebElement)
            .getText().then(actual => {
                try{
                    doAssert(actual, expected)
                }
                catch(err){
                    throw new Error(err)
                }
            })
        },

        assertValue: async function (locator, parentWebElement, expected) {
            await methods
            .find(locator, parentWebElement)
            .getAttribute("value").then(actual => {
                try{
                    doAssert(actual, expected)
                }
                catch(err){
                    throw new Error(err)
                }
            })
        },

        assertAttribute: async function (locator, parentWebElement, expected) {
            for(let key of Object.keys(expected)){
                await methods
                .find(locator, parentWebElement)
                .getAttribute(key).then(function (actual) {
                    try{
                        doAssert(actual, expected[key])
                    }
                    catch(err){
                        throw new Error(err)
                    }
                })
            }
        },

        assertCssValue: function (locator, parentWebElement, expected) {
            for(let key of Object.keys(expected)){
                methods
                .find(locator, parentWebElement)
                .getCssValue(key).then(function (actual) {
                    try{
                        doAssert(actual, expected[key])
                    }
                    catch(err){
                        throw new Error(err)
                    }
                })
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
            methods
            .find(locator, parentWebElement)
            .getText().then(actual => {
                try{
                    doAssert(actual, expectedText)
                }
                catch(err){
                    throw new Error(err)
                }
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
            methods
            .find(locator, parentWebElement)
            .getAttribute(attribute).then(function (actual) {
                try{
                    doAssert(actual, expectedText)
                }
                catch(err){
                    throw new Error(err)
                }
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

async function checkElementState(ele, expectedStatus){

    switch (expectedStatus) {
        case "visible":
            assert.isTrue(await ele.isDisplayed(), expectedStatus)
            break;
        case "enabled": case "editable": 
            assert.isTrue(await ele.isEnabled(), expectedStatus)
            break;
        case "disabled": case "notEditable": 
            assert.isFalse(await ele.isEnabled(), expectedStatus)
            break;
        case "selected": case "checked": 
            assert.isTrue(await ele.isSelected(), expectedStatus)
            break;   
        case "notSelected": case "notChecked":  case "unchecked": case "unselected": 
            assert.isFalse(await ele.isSelected(), expectedStatus)
            break;  
        default:
            break;
    }
}

function doAssert(actual, expected, msg){
    let comparator = "equal", value = ""
    if(typeof expected == "string") {
        comparator = "equal"
        value = expected
    }
    else{
        let keys = Object.keys(expected)
        comparator = keys[0]
        value = expected[keys[0]]
    }
    console.log("actual: " + actual);
    console.log("expected: " + value);
    switch (comparator) {
        case "equal": case "==":
            assert.equal(actual, value, msg)
            break;
        case "notEqual": case "!=":
            assert.notEqual(actual, value, msg)
            break;
        case "contains": case "has": case "includes": case "*=":
            assert.include(actual, value, msg)
            break;
        case "notContains": case "notHas": case "notIncludes":
            assert.notInclude(actual, value, msg)
            break;
        case "match": case "~=":
            assert.match(actual, value, msg)
            break;
        case "notMatch":
            assert.notMatch(actual, value, msg)
            break;
        case "greaterThan": case "moreThan": case ">":
            assert.isAbove(Number(actual), Number(value), msg)
            break;
        case "lessThan": case "<":
            assert.isBelow(Number(actual), Number(value), msg)
            break; 
        case "noMoreThan": case "<=":
            assert.isAtMost(Number(actual), Number(value), msg)
            break; 
        case "noLessThan": case ">=":
            assert.isAtLeast(Number(actual), Number(value), msg)
            break;                  
        default:
            assert.equal(actual, value, msg)
            break;
    }
}
