module.exports = {
    express: {
        files: ['<%= dir.script  %>/**/*.js', '<%= dir.theme %>/**/*.js', '<%= dir.theme %>/**/*.dust'],

        tasks: ['express:dev'],
        options: {
            // According to express docu, 'spawn: false' is needed for the
            // server to reload
            livereload: true,
            spawn: false
        }
    },
    'check-own': {
        files: ['<%= jshint.own.src %>'],
        tasks: ['jshint:own', 'jscs:own']
    },
    'check-libs': {
        files: ['<%= jshint.libs.src %>'],
        tasks: ['jshint:libs', 'jscs:libs']
    },
    'check-all': {
        files: ['<%= jshint.all.src %>'],
        tasks: ['jshint:all', 'jscs:all']
    },
    less: {
        files: ['<%= dir.theme %>/themes/**/*.less'],
        tasks: ['less:all']
    }
};
