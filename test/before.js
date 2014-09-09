before(function(done) {
	process.env.nemoData = JSON.stringify({
		"targetBaseUrl": "http://warm-river-3624.herokuapp.com/",
		"targetBrowser": "phantomjs",
		"autoBaseDir": process.cwd() + "/test"
	});
	done();
});
	