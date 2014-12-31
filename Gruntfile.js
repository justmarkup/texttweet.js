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
		watch: {
			 js: {
		        files: ['src/**/*.js'],
		        tasks: ['uglify']
		    }
		}
    });

    grunt.registerTask('default', []);

};