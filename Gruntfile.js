module.exports = function(grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        docco: {
            debug: {
                src: ['test/**/*.js'],
                options: {
                    output: 'docs/'
                }
            }
        },

        express: {
            dev: {
                options: {
                    script: 'gui-resources/scripts/js/server.js',
                    port: 3000
                }
            }
        },

        jshint: {
            options: {
                ignores: ['gui-resources/scripts/js/bower_components/**']
            },
            own: {
                src: ['Gruntfile.js', 'gui-resources/scripts/js/**/*.js', '!gui-resources/scripts/js/core/**/*.js']
            },
            libs: {
                src: ['gui-resources/scripts/js/core/**/*.js']
            },
            all: {
                src: ['Gruntfile.js', 'gui-resources/scripts/js/**/*.js']
            }
        },

        open: {
            dev: {
                path: 'http://localhost:<%= express.dev.options.port %>'
            }
        },

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

        watch: {
            express: {
                files: ['gui-resources/scripts/js/**/*.js'],
                tasks: ['express:dev'],
                options: {
                    // According to express docu, 'spawn: false' is needed for the
                    // server to reload, but if we use it the browser is reloaded
                    // before the server is ready
                    //spawn: false,
                    livereload: true
                }
            },
            'hint-own': {
                files: ['<%= jshint.own.src %>'],
                tasks: ['jshint:own']
            },
            'hint-libs': {
                files: ['<%= jshint.libs.src %>'],
                tasks: ['jshint:libs']
            },
            'hint-all': {
                files: ['<%= jshint.all.src %>'],
                tasks: ['jshint:all']
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

    grunt.registerTask('server', ['express:dev', 'open:dev', 'watch:express']);
    grunt.registerTask('lint', ['watch:hint-all']);
    grunt.registerTask('build', ['jshint:all','requirejs']);

    grunt.registerTask('default', ['express:dev', 'open:dev', 'watch:express']);
};
