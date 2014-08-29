var should = require('chai').should(),
	nemoFactory = require('nemo-mocha-factory'),
	plugins = require('./plugins'),
	nemo = {},
	logs,
	setup = {
		"view": ["simple"]
	};

describe("nemo-view @verySimple@travis@", function() {
	nemoFactory({
		"context": nemo,
		"plugins": plugins,
		"setup": setup
	});

	beforeEach(function(done) {
		//can we access driver logs?
		//logs = new nemo.wd.WebDriver.Logs(nemo.driver);

		nemo.driver.get(nemo.props.targetBaseUrl);
		nemo.driver.sleep(2000).then(function () {
			done()
		}, function(err) {
			done(err);
		})
	})
	it("should use the form view to enter values and write to outy div @useView@", function(done) {
		nemo.view.simple.outBox().getText().then(function(outText) {
			console.log("outText", outText);
			
				done();
		}, function(err) {
			done(err);
		});
	});

});