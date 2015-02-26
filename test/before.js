/* global before */
'use strict';

var path = require('path');
before(function(done) {
	process.env.nemoData = JSON.stringify({
		'targetBaseUrl': 'http://warm-river-3624.herokuapp.com',
		'targetBrowser': 'phantomjs',
		'autoBaseDir': path.resolve(__dirname)
	});
	done();
});
	