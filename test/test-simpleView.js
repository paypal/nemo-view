var should = require('chai').should(),
    nemoFactory = require('nemo-mocha-factory'),
    plugins = require('./plugins'),
    nemo = {},
    logs,
    setup = {
        "view": ["form"]
    };

describe("nemo-view @simpleViewSuite@travis@", function () {
    nemoFactory({
        "context": nemo,
        "plugins": plugins,
        "setup": setup
    });

    beforeEach(function (done) {
        //can we access driver logs?
        //logs = new nemo.wd.WebDriver.Logs(nemo.driver);

        nemo.driver.get(nemo.props.targetBaseUrl);
        nemo.driver.sleep(2000).then(function () {
            done()
        }, function (err) {
            done(err);
        })
    })
    it("should open up the heroku app for testing", function (done) {
        nemo.driver.sleep(200).then(function () {
            done();
        }, function (err) {
            done(err);
        })
    });
    it("should use the form view to enter values and write to outy div @useView@", function (done) {
        nemo.view.form.fooText().sendKeys("foo");
        nemo.driver.sleep(300);
        nemo.view.form.fooButton().click();
        nemo.view.form.barText().sendKeys("bar");
        nemo.view.form.barButton().click();
        nemo.view.form.bingText().sendKeys("bing");
        nemo.view.form.bingButton().click();
        nemo.view.form.bangText().sendKeys("bang");
        nemo.view.form.bangButton().click();
        nemo.driver.sleep(3000);
        nemo.view.form.outBox().getText().then(function (outText) {
            console.log("outText", outText);
            if (outText !== "foobarbingbang") {
                done(new Error("didn't get what we shoulda"));
            } else {
                done();
            }
        }, function (err) {
            done(err);
        });
    });
    it('should wait for element to be visible', function (done) {
        nemo.view.form.fooButtonWaitVisible(1000, 'foo button is not visible').then(function (element) {
            if (element === undefined) {
                done(new Error('Element should have been returned by WaitVisible method'))
            }
            done();
        }, function (err) {
            done(err);
        });
    });
    it('should not find element and wait should timeout',function(done){
        nemo.view.form.notThereWaitVisible(1000).then(function(element){
            done(new Error('Found element that is not there'));
        },function(err){
            done();
        });
    });
});