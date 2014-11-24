/* global require,module */
'use strict';
var nconf = require('nconf');

module.exports = function(grunt) {
	nconf.env()
		.argv();
	grunt.initConfig({
		simplemocha: {
			options: {
				globals: ['should'],
				timeout: 30000,
				ignoreLeaks: false,
				grep: grunt.option('grep') || 0,
				ui: 'bdd',
				reporter: 'spec'
			},

			all: {
				src: ['test/*.js']
			}
		},
		jshint: {
			files: ['index.js', 'Gruntfile.js', 'setup/*.js'],
			options: {
				jshintrc: true
			}
		}
	});

	// test
	grunt.loadNpmTasks('grunt-simple-mocha');
	// lint
	grunt.loadNpmTasks('grunt-contrib-jshint');
	// default
	grunt.registerTask('default', ['simplemocha', 'jshint']);
};
