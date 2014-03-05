'use strict';

module.exports = function(grunt) {

    // Load all grunt task declared in package.json
    require('load-grunt-tasks')(grunt);

    // var server =  grunt.option('server') || 'http://localhost:9000',
    //     port = server.

    // Define basic configuration
    var config = grunt.file.readJSON('./config.json');
    config.pkg = grunt.file.readJSON('./package.json');

    // Load the basic configuration and additional from tasks/options
    require('load-grunt-config')(grunt, {
        config: config,
        configPath: require('path').join(__dirname, 'tasks', 'options'),
        init: true
    });

    // Install the jshint pre-commit hook
    grunt.registerTask('install-hook', function () {
        var fs = require('fs');

        // my precommit hook is inside the repo as /hooks/pre-commit
        // copy the hook file to the correct place in the .git directory
        grunt.file.copy('hooks/pre-commit', '.git/hooks/pre-commit');

        // chmod the file to readable and executable by all
        fs.chmodSync('.git/hooks/pre-commit', '755');
    });

    grunt.registerTask('server', ['express:dev', 'open:dev', 'watch:express']);
    grunt.registerTask('hint', ['jshint:all']);
    grunt.registerTask('build', ['jshint:all','requirejs']);

    grunt.registerTask('default', ['express:dev', 'open:dev', 'watch:express']);
};
