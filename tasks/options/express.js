module.exports = {
    dev: {
        options: {
            script: '<%= dir.script  %>/server.js',
            port: '<%= server.port %>'
        }
    },

    prod: {
        options: {
            script: '<%= dir.script  %>/server.js',
            port: '<%= server.port %>',
            background: false
        }
    }
};
