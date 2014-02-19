module.exports = {
    express: {
        files: ['<%= dir.script  %>/**/*.js', '<%= dir.theme %>/**/*.js', '<%= dir.theme %>/**/*.dust'],

        tasks: ['express:dev'],
        options: {
            // According to express docu, 'spawn: false' is needed for the
            // server to reload, but if we use it the browser is reloaded
            // before the server is ready
            livereload: true,
            nospawn: true
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
};