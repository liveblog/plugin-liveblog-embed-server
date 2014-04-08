'use strict';
var path = require('path');

module.exports = {
    options: {
        compress: true
    },
    // Compile all base-theme.less files to liveblog.css files
    all: {
        expand: true,
        cwd: '<%= paths.theme %>/themes/',
        src: [
            '**/*.less',
            '!zeit/**/*.less',
            '!zeit_solo/**/*.less'
        ],
        dest: '<%= paths.theme %>/themes/',
        ext: '.css',
        rename: function(dest, src) {
            return path.join(dest, src.replace(/base-theme/, 'liveblog'));
        }
    },
    // Compile the base-theme.less file corresponding to the theme and
    // environment in config.json to liveblog.css
    theme: {
        files: {
            '<%= paths.theme %>/themes/<%= app.theme %>/<%= app.environment %>/liveblog.css':
            '<%= paths.theme %>/themes/<%= app.theme %>/<%= app.environment %>/base-theme.less'
        }
    }
};
