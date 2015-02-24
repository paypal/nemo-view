before(function(done) {
	process.env.nemoData = JSON.stringify({
		"targetBaseUrl": "http://localhost:8000",//"http://warm-river-3624.herokuapp.com",
		"targetBrowser": "chrome",
		"autoBaseDir": process.cwd() + "/test"
	});
	done();
});
	