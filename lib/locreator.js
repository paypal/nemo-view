'use strict';

var async = require('async');

module.exports = function locreator(nemo, locatorId, locatorJSON, parentWebElement) {
    var locatorObject = {};

    locatorObject[locatorId] = function () {
        return nemo.drivex.find(locatorJSON[locatorId], parentWebElement);
    };
    locatorObject[locatorId + 'By'] = function () {
        return nemo.drivex.by(locatorJSON[locatorId]);
    };
    locatorObject[locatorId + 'Present'] = function () {
        return nemo.drivex.present(locatorJSON[locatorId], parentWebElement);
    };
    locatorObject[locatorId + 'Wait'] = function (timeout, msg) {
        function waitReturnElement() {
            return nemo.drivex.waitForElement(locatorJSON[locatorId], timeout || 5000, msg).then(function () {
                return nemo.drivex.find(locatorJSON[locatorId], parentWebElement);
            });
        }

        var wep = new nemo.wd.WebElementPromise(nemo.driver, waitReturnElement());
        return wep;
    };
    locatorObject[locatorId + 'WaitVisible'] = function (timeout, msg) {
        function waitVisibleReturnElement() {
            return nemo.driver.wait(function () {
                return nemo.drivex.visible(locatorJSON[locatorId]);
            }, timeout || 5000, msg).then(function () {
                return nemo.drivex.find(locatorJSON[locatorId], parentWebElement);
            });
        }

        var wep = new nemo.wd.WebElementPromise(nemo.driver, waitVisibleReturnElement());
        return wep;
    };
    locatorObject[locatorId + 'Visible'] = function () {
        return nemo.drivex.visible(locatorJSON, parentWebElement);
    };
    locatorObject[locatorId + 'OptionText'] = function (optionText) {
        var d = nemo.wd.promise.defer();
        nemo.drivex.find(locatorJSON[locatorId], parentWebElement).then(function (selectEl) {
            selectEl.findElements(nemo.wd.By.css('option')).then(function (elts) {
                var current = 0;
                var total = elts.length;
                var found = false;
                async.whilst(
                    function () {
                        return current < total;
                    },
                    function (callback) {
                        var elt = elts[current++];
                        elt.getText().then(function (txt) {
                            if (txt === optionText) {
                                found = elt;
                            }
                            callback();
                        });
                    },
                    function (err) {
                        if (found !== false) {
                            d.fulfill(found.click());
                        } else {
                            d.reject(new Error('couldn\'t find option with text: ' + optionText));
                        }
                    }
                );
            });
        });
        return d;
    };
    locatorObject[locatorId + 'OptionValue'] = function (optionValue) {
        //select an option by its value (works only for Select elements)
        return nemo.drivex.find(locatorJSON[locatorId], parentWebElement).then(function (selectEl) {
            return selectEl.findElement(nemo.wd.By.css('option[value=\'' + optionValue + '\']')).then(function (element) {
                return element.click();
            }, function (err) {
                throw new Error(err);
            });
        }, function (err) {
            throw new Error(err);
        });
    };
    return locatorObject;
};