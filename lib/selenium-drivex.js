var debug = require("debug");
var log = debug("selenium-drivex");
var async = require("async");
var assert = require('chai').assert

module.exports = function drivex(driver, wd) {
    var methods = {
        find: async function (locator, el) {
            return (el ? el : driver).findElement(locator);
        },
        /**
         * wraps Selenium WebDriver/WebElement.findElements
         * @param locator {LocatorJSON}
         * @param el {WebElement}
         * @returns {Promise} resolves to an array of WebElements or []
         */
        finds: async function (locator, el) {
            return (el ? el : driver).findElements(locator);
        },
        /**
         * wraps Selenium WebDriver/WebElement.isElementPresent
         * @param locator {LocatorJSON}
         * @param el {WebElement}
         * @returns {Promise} resolves to true or rejected
         */
        present: async function (locator, el) {
            return (el ? el : driver).isElementPresent(locator);
        },
        /**
         * wraps Selenium WebElement.isVisible
         * @param locator {LocatorJSON}
         * @param el {WebElement}
         * @returns {Promise} resolves to true or rejected
         */
        visible: async function (locator, el) {
            return methods.find(locator, el).then(function (elt) {
                return elt.isDisplayed();
            });
        },
        /**
         * Wait for timeout milliseconds for the WebElement to be present
         * @param locator {LocatorJSON}
         * @param timeout {Number}
         * @param msg {String} optional message for any error messages
         * @returns {Promise} resolves to true or throw error
         */
        waitForElement: async function (locator, timeout, msg) {
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
            return driver
                .wait(
                    function () {
                        return methods.present(locator);
                    },
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
        selectByOptionText: async function (locator, optionText, parentWebElement) {
            return methods.find(locator, parentWebElement).then(
                async function (selectEl) {
                    return selectEl
                        .findElement(wd.By.xpath(".//option[text()='" + optionText + "']"))
                        .then(
                            async function (element) {
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
        selectByOptionValue: async function (
            locator,
            optionValue,
            parentWebElement
        ) {
            return methods.find(locator, parentWebElement).then(
                async function (selectEl) {
                    return selectEl
                        .findElement(wd.By.css("option[value='" + optionValue + "']"))
                        .then(
                            async function (element) {
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

        assertText: async function (locator, parentWebElement, expected) {
            await methods
            .find(locator, parentWebElement)
            .getText().then(function (actual) {
                doAssert(actual, expected)
            })
        },

        assertValue: async function (locator, parentWebElement, expected) {
            await methods
            .find(locator, parentWebElement)
            .getAttribute("value").then(function (actual) {
                doAssert(actual, expected)
            })
        },

        assertAttribute: async function (locator, parentWebElement, expected) {
            for(let key of Object.keys(expected)){
                await methods
                .find(locator, parentWebElement)
                .getAttribute(key).then(function (actual) {
                    doAssert(actual, expected[key])
                })
            }
        },

        assertCssValue: async function (locator, parentWebElement, expected) {
            for(let key of Object.keys(expected)){
                await methods
                .find(locator, parentWebElement)
                .getCssValue(key).then(function (actual) {
                    doAssert(actual, expected[key])
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
            var d = wd.promise.defer();
            methods
                .find(locator, parentWebElement, expectedText)
                .getText()
                .then(function (actual) {
                    log(
                        "validateText : actual : " + actual + " expected : " + expectedText
                    );
                    if (actual === expectedText) {
                        d.fulfill(true);
                    } else {
                        d.reject(
                            new Error(
                                "[drivex.validateText] couldn't find text: " +
                                JSON.stringify(expectedText) +
                                " for locator " +
                                showLocator(locator)
                            )
                        );
                    }
                });
            return d;
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
            var d = wd.promise.defer();
            methods
                .find(locator, parentWebElement, expectedText)
                .getAttribute(attribute)
                .then(function (actual) {
                    log(
                        "validateAttributeValue : actual : " +
                        actual +
                        " expected : " +
                        expectedText
                    );
                    if (actual === expectedText) {
                        d.fulfill(true);
                    } else {
                        d.reject(
                            new Error(
                                "[drivex.validateAttributeValue] couldn't find value " +
                                JSON.stringify(expectedText) +
                                " for locator " +
                                showLocator(locator) +
                                " and attribute " +
                                JSON.stringify(attribute)
                            )
                        );
                    }
                });
            return d;
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

function doAssert(actual, expected){
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
    
    switch (comparator) {
        case "equal": case "==":
            assert.equal(actual, value)
            break;
        case "notEqual": case "!=":
            assert.notEqual(actual, value)
            break;
        case "contains": case "has": case "includes": case "*=":
            assert.include(actual, value)
            break;
        case "notContains": case "notHas": case "notInclude":
            assert.notInclude(actual, value)
            break;
        case "match": case "~=":
            assert.match(actual, value)
            break;
        case "notMatch":
            assert.notMatch(actual, value)
            break;
        case "greaterThan": case "moreThan": case ">":
            assert.isAbove(Number(actual), Number(value))
            break;
        case "lessThan": case "<":
            assert.isBelow(Number(actual), Number(value))
            break; 
        case "noMoreThan": case "<=":
            assert.isAtMost(Number(actual), Number(value))
            break; 
        case "noLessThan": case ">=":
            assert.isAtLeast(Number(actual), Number(value))
            break;                  
        default:
            assert.equal(actual, value)
            break;
    }
}