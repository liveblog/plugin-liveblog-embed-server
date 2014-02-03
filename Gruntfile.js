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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');

    grunt.loadNpmTasks('grunt-docco');

    grunt.registerTask('default', ['requirejs']);


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

};
