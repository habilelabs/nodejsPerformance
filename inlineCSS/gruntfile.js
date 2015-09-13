module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uncss: {
            dist: {
                files: {
                    'mail.css': ['index.html']
                }
            }
        },
        cssmin: {
			options: {
                keepSpecialComments: 0
            },
            target: {
                files: [{
                    src: ['mail.css'],
                    dest: 'mail.min.css'
				}]
            }
        }
    });
    grunt.loadNpmTasks('grunt-uncss');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', ['uncss','cssmin']);
};
