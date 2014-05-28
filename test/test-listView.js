var should = require('chai').should(),
	nemoFactory = require('nemo-mocha-factory'),
	plugins = require('./plugins'),
	nemo = {},
	setup = {
		"view": ["formElementList"]
	};

describe("nemo-view @listViewSuite@travis@", function () {
	nemoFactory({"context": nemo, "plugins": plugins, "setup": setup});
	beforeEach(function(done) {
		nemo.driver.get(nemo.props.targetBaseUrl);
		nemo.driver.sleep(2000).then(function () {
			done()
		}, function(err) {
			done(err);
		})
	})
	it("should open up the heroku app for testing", function(done) {
		nemo.driver.sleep(200).then(function() {
			done();
		}, function(err) {
			done(err);
		})
	});
	it("should use the form list view to enter values and write to outy div @useView@", function(done) {
		nemo.view.formElementList.inputGroup().then(function(elts) {
			elts.forEach(function(elt) {
				nemo.driver.sleep(300);
				elt.text().sendKeys("abcd");
				nemo.driver.sleep(300);
				elt.button().click();
			});
			nemo.view.formElementList.outBox().getText().then(function(outText) {
				if (outText === "abcdabcdabcdabcd") {
					done();
				} else {
					done(new Error("didn't get what we shoulda"));
				}
			})
		});

	})
	
});