before(function(done) {
	process.env.nemoData = JSON.stringify({
		"targetBaseUrl": "http://warm-river-3624.herokuapp.com/",
		"targetBrowser": "phantomjs",
		"autoBaseDir": process.cwd() + "/test",
		// "serverProps": {
		// 	"port": 4444
		// },
		// "targetServer": "localhost",
		// "seleniumJar": "/usr/local/bin/selenium-server-standalone.jar"
	});
	done();
});
	