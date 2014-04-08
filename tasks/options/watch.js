module.exports = {
    express: {
        files: ['<%= paths.script  %>/**/*.js', '<%= paths.theme %>/**/*.js', '<%= paths.theme %>/**/*.dust'],

        tasks: ['express:dev'],
        options: {
            // According to express docu, 'spawn: false' is needed for the
            // server to reload
            livereload: true,
            spawn: false
        }
    },
    hint: {
        files: ['<%= jshint.all.src %>'],
        tasks: ['jshint:all', 'jscs:all']
    },
    less: {
        files: ['<%= paths.theme %>/themes/**/*.less'],
        tasks: ['less:all']
    },
    mocha: {
        files: [
            '<%= jshint.source.src %>',
            '<%= jshint.tests.src %>',
            '!<%= dir.test %>/client/**/*.js'
        ],
        tasks: ['simplemocha:all']
    }
};
