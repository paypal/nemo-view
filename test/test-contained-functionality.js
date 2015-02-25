var should = require('chai').should(),
	nemoFactory = require('nemo-mocha-factory'),
	plugins = require('./plugins'),
	path = require('path'),
	nemo = {},
	setup = {
		
	};
	plugins.plugins.login = {
		"module": path.resolve(__dirname, 'plugin/shared-fn-plugin'),
		"register": true
	};

describe("nemo-view @pluginContainedFunctionality@travis@", function () {
	nemoFactory({"context": nemo, "plugins": plugins, "setup": setup});
	beforeEach(function (done) {
		nemo.driver.get(nemo.props.targetBaseUrl + '/login').then(function () {
			done()
		}, function (err) {
			done(err);
		})
	})

	it("should complete the shared functionality", function (done) {
		nemo.login.login('medelman-buyer@paypal.com', '11111111');
		nemo.login.logout().then(function() {
			done();
		}, function(err) {
			done(err);
		});
	})

});