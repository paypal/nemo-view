var assert = require('assert'),
	nemoFactory = require('nemo-mocha-factory'),
	plugins = require('./plugins'),
	nemo = {},
	setup = {
		"view": [
			{
				"name": "login",
				"locator": "module:nemo-shared-objects/login"
			}
		]
	};

describe("nemo-view @moduleViewSuite@", function () {
	nemoFactory({"context": nemo, "plugins": plugins, "setup": setup});


	it("should find the PayPal login email locator", function (done) {
    var emailLocator = nemo.view.login.emailBy();
    console.log(emailLocator);
		assert.deepEqual(emailLocator, {"using": "id", "value": "login_email"});
     done();
	});

});