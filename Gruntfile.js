module.exports = function(grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        requirejs: {
            compile: {
                options: {
                    mainConfigFile: 'gui-resources/scripts/js/main.js',
                    baseUrl: 'gui-resources/scripts/js/',
                    name: 'main',
                    out: 'build/app.min.js',
                    findNestedDependencies: true
                }
            }
        },
        docco: {
            debug: {
                src: ['test/**/*.js'],
                options: {
                    output: 'docs/'
                }
            }
        },
        jshint: {
            // Exclude files from linting using .jshintignore file
            options: {
                jshintrc: true,
                ignores: ['gui-resources/scripts/js/bower_components/**']
            },
            all: {
                src: ['Gruntfile.js', 'gui-resources/scripts/js/**/*.js']
            },
            nolibs: {
                src: ['Gruntfile.js', 'gui-resources/scripts/js/**/*.js', '!gui-resources/scripts/js/core/**/*.js']
            },
            libs: {
                src: ['gui-resources/scripts/js/core/**/*.js']
            }
        },
        watch: {
            all: {
                files: ['<%= jshint.all.src %>'],
                tasks: ['jshint:all']
            },
            nolibs: {
                files: ['<%= jshint.nolibs.src %>'],
                tasks: ['jshint:nolibs']
            },
            libs: {
                files: ['<%= jshint.libs.src %>'],
                tasks: ['jshint:libs']
            }
        }
    });

    // Load all grunt task declared in package.json
    require('load-grunt-tasks')(grunt);

    grunt.registerTask('install-bower', 'install the frontend dependencies', function() {
            var exec = require('child_process').exec;
            var cb = this.async();
            exec('bower install', {cwd: '.'}, function(err, stdout, stderr) {
                console.log(stdout);
                cb();
            });
        });

    grunt.registerTask('install-hook', function () {
            var fs = require('fs');

            // my precommit hook is inside the repo as /hooks/pre-commit
            // copy the hook file to the correct place in the .git directory
            grunt.file.copy('hooks/pre-commit', '.git/hooks/pre-commit');

            // chmod the file to readable and executable by all
            fs.chmodSync('.git/hooks/pre-commit', '755');
        });

    grunt.registerTask('default', ['jshint:all','requirejs']);
};
