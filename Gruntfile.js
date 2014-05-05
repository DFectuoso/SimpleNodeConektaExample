'use strict';
module.exports = function (grunt) {
	grunt.initConfig({
		watch: {
			assets: {
				files: ['public/stylus/*.styl'],
				tasks: ['stylus']
			}
		},
		// mochaTest: {
		// 	test: {
		// 		options: {
		// 			reporter: 'spec'
		// 		},
		// 		src: ['test/*.js']
		// 	}
		// }
		stylus: {
			compile: {
				options: {
					compress : false
				},
				files: {
					'public/css/main.css': 'public/stylus/main.styl'
				}
			}
		},
		nodemon: {
			server: {
				script: 'app.js',
				options: {
					nodeArgs: ['--debug']
				}
			}
		}
	});

	// grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-nodemon');

	grunt.registerTask('assets', ['watch:assets']);

	grunt.registerTask('default');
};