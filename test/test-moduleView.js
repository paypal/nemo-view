var should = require('chai').should(),
	nemoFactory = require('nemo-mocha-factory'),
	plugins = require('./plugins'),
	nemo = {},
	logs,
	setup = {
		"view": [
			{
				"name": "login",
				"locator": "module:nemo-paypal-locators/login"
			}
		]
	};

describe("nemo-view @moduleViewSuite@", function () {
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

	it("should find the PayPal login email field", function (done) {
		nemo.view.login.emailPresent().then(function (isIt) {
			if (isIt === true) {
				return;
			} else {
				done(new Error("The login view didn't come through"));
			}
		})
			.then(function () {
				//logs.get('client').then(function (types) {
				//	console.log(types);
				done()
				//});
			}, function(err) {
				done(err);
			})
	});

});