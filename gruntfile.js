var mozjpeg = require('imagemin-mozjpeg');
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            js: {
                files: {
                    'app/webroot/dist/combined.js': [
                    'app/dev-webroot/js/jquery-1.11.3.min.js',
                    'app/dev-webroot/js/bootstrap.min.js'
                    ]
                }
            }
        },
        concat: {
            dist: {
                src: [
                    'app/dev-webroot/css/bootstrap.min.css',
                    'app/dev-webroot/css/font-awesome.min.css'
                    ],
                dest: 'app/dev-webroot/dist/combined.css'
            }
        },
        cssmin: {
            options: {
                keepSpecialComments: 0
            },
            target: {
                files: [{
                    src: ['app/dev-webroot/dist/combined.css'],
                    dest: 'app/webroot/dist/combined.min.css'
				}]
            }
        },
        processhtml: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'app/dev-view',
                        src: ['**/*.ejs'],
                        dest: 'app/dev-view/dist',
                        ext: '.ejs'
                    }]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    minifyJS: true,
                    minifyCSS: true,
                    preventAttributesEscaping: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'app/dev-view/dist',
                        src: '**/*.ejs',
                        dest: 'app/view'
                    },
                    {
                        expand: true,
                        cwd: 'app/dev-webroot/html',
                        src: '**/*.html',
                        dest: 'app/webroot/html'
                    }
                ]
            }
        },
        clean: {
            build: ['app/dev-view/dist', 'app/view/inlineCSS.ejs', 'app/view/particle', 'app/dev-webroot/dist/']
        },
        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 4,
                    svgoPlugins: [{
                        removeViewBox: false
                    }],
                    use: [mozjpeg()]
                },
                files: [{
                    expand: true,
                    cwd: 'app/dev-webroot/img/', // Src matches are relative to this path 
                    src: ['**/*.{png,jpg,gif}'], // Actual patterns to match 
                    dest: 'app/webroot/img/' // Destination path prefix 
                }]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.registerTask('default', ['concat', 'cssmin', 'uglify:js', 'processhtml', 'imagemin','htmlmin', 'clean']);
};
