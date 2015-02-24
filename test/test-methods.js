var should = require('chai').should(),
    nemoFactory = require('nemo-mocha-factory'),
    plugins = require('./plugins'),
    nemo = {},
    logs,
    setup = {
        'view': ['simple']
    };

describe('nemo-view @methods@travis@', function () {
    nemoFactory({
        'context': nemo,
        'plugins': plugins,
        'setup': setup
    });

    beforeEach(function (done) {
        //can we access driver logs?
        //logs = new nemo.wd.WebDriver.Logs(nemo.driver);
        nemo.driver.get('http://www.google.com').then(function () {
            done()
        }, function (err) {
            done(err);
        })
    });
    it('should return a @locatorObject@', function (done) {
        var locator = nemo.view.simple.outBoxBy();
        if (locator.using && locator.value) {
            done();
        } else {
            done(new Error('didnt get back a locator object'));
        }
    });
    it('should appropriately use a timeout argument to the @Wait@ method in a failure scenario', function (done) {
        var start = Date.now();
        nemo.view.simple.outBoxWait(13000, 'didnt find outbox').then(function (find) {
            console.log('timeout in ', found);
            done(new Error('found outBox but should not have'));
        }, function (err) {
            var found = Date.now() - start;
            if (found > 13800 || found < 12500) {
                done(new Error('found false but in the wrong period of time'));
            } else {
                done();
            }
        });
    });
    it('should appropriately use a DIFFERENT timeout argument to the @Wait@ method in a failure scenario', function (done) {
        var start = Date.now();
        nemo.view.simple.outBoxWait(3000, 'didnt find outbox').then(function () {
            console.log('timeout in ', found);
            done(new Error('found outBox but should not have'));
        }, function (err) {
            var found = Date.now() - start;
            if (found > 3800 || found < 2500) {
                done(new Error('found false but in the wrong period of time, ', found));
            } else {
                done();
            }
        });
    });
    it('should find an existing element using the @Wait@ method', function (done) {
        nemo.driver.sleep(2000);
        nemo.view.simple.googleSearchBoxWait(3000, 'didn\t find search box').then(function () {
            done();
        }, function (err) {
            done(new Error('something went wrong here'));
        })
    });
});