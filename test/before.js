before(function(done) {
	process.env.nemoData = JSON.stringify({
		"targetBaseUrl": "http://warm-river-3624.herokuapp.com/",
		"targetBrowser": "firefox",
		"autoBaseDir": process.cwd() + "/test",
		"serverProps": {
			"port": 4444
		},
		"targetServer": "http://bluefinlvs24.qa.paypal.com:4444/wd/hub",
		"seleniumJar": "/usr/local/bin/selenium-server-standalone.jar"
	});
	done();
});
	