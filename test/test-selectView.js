/* global describe,beforeEach,it */
var nemoFactory = require('nemo-mocha-factory'),
    plugins = require('./plugins'),
    nemo = {},
    path = require('path'),
    util = require(path.resolve(__dirname, 'util')),
    setup = {
        'view': ['selectView']
    };

describe('nemo-view @simpleViewSuite@', function () {
    nemoFactory({
        'context': nemo,
        'plugins': plugins,
        'setup': setup
    });

    beforeEach(function (done) {
        nemo.driver.get(nemo.props.targetBaseUrl + '/selects');
        util.waitForJSReady(nemo).then(util.doneSuccess(done), util.doneError(done));
    });
    it('should select option by @Select@OptionValue@positive@ method', function (done) {
        nemo.view.selectView.selectOptionValue('2');
        nemo.view.selectView.select().getAttribute('value').then(function (value) {
            if (value === '2') {
                done();
            } else {
                done(new Error('Correct option was not selected'));
            }
        });
    })
    it('should NOT select option by @Select@OptionValue@negative@ method', function (done) {
        nemo.view.selectView.selectOptionValue('does not exist').then(function() {
            done(new Error('Correct option was not selected'));
        },function(err) {
            done();
        });
    })
    it('should select option by @Select@OptionText@positive@ method', function (done) {
        nemo.view.selectView.selectOptionText('Value of 2');
        nemo.view.selectView.select().getAttribute('value').then(function (value) {
            if (value === '2') {
                done();
            } else {
                done(new Error('Correct option was not selected'));
            }
        });
    })
    it('should NOT select option by @Select@OptionText@negative@ method', function (done) {
        nemo.view.selectView.selectOptionText('does not exist').then(function() {
            done(new Error('Correct option was not selected'));
        },function(err) {
            done();
        });
    })
});