module.exports = {
    options: {
        script: '<%= paths.script  %>/server.js',
        port: '<%= paths.port %>'
    },
    dev: {
        options: {
            livereload: true
        }
    },
    prod: {
        options: {
            background: false
        }
    }
};
