/* global before */
'use strict';

var path = require('path');
before(async function () {
  process.setMaxListeners(20);
  process.env.nemoBaseDir = path.join(process.cwd(), 'test');
});
	