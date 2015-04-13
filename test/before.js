/* global before */
'use strict';

var path = require('path');
before(function(done) {
  process.setMaxListeners(20);
  process.env.nemoBaseDir = path.join(process.cwd(), 'test');
	done();
});
	