var should = require('chai').should(),
	nemoFactory = require('nemo-mocha-factory'),
	loginFlow = require('nemo-shared-objects/flow/login'),
	plugins = require('./plugins'),
	path = require('path'),
	nemo = {},
	logs,
	setup = {
		
	};
	plugins.plugins.login = {
		"module": path.resolve(__dirname, 'plugin/shared-fn-plugin'),
		"register": true
	};

describe("nemo-view @containedFunctionality@", function () {
	nemoFactory({"context": nemo, "plugins": plugins, "setup": setup});
	beforeEach(function (done) {
		//can we access driver logs?
		//logs = new nemo.wd.WebDriver.Logs(nemo.driver);

		nemo.driver.get("https://www.paypal.com").then(function () {
			done()
		}, function (err) {
			done(err);
		})
	})

	it("should complete the shared functionality", function (done) {
		nemo.login.login('medelman-buyer@paypal.com', '11111111');
		//nemo.driver.sleep(15000);
		nemo.login.logout().then(function() {
			done();
		}, function(err) {
			done(err);
		});
	})

});