module.exports = function(grunt){

	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
		    build: {
		    	options: {
		    		preserveComments: 'some'
		    	},
		        files: {
		            'dist/texttweet.min.js': ['src/texttweet.js']
		        }
		    }
		},
		jshint: {
			options: {
				 "indent": 2
			},
			all: [
				'Gruntfile.js',
				'src/*.js'
			]
		},
		watch: {
			js: {
		        files: 'src/**/*.js',
		        tasks: 'uglify'
		    },
		    jshint: {
                files: 'src/**.js',
                tasks: 'jshint'
            }
		}
    });

    grunt.registerTask('default', []);

};