module.exports = {
    options: {
        ignores: ['<%= dir.script  %>/bower_components/**']
    },
    own: {
        src: ['Gruntfile.js', '<%= dir.script  %>/**/*.js', '!<%= dir.script  %>/core/**/*.js']
    },
    libs: {
        src: ['<%= dir.script  %>/core/**/*.js']
    },
    all: {
        src: ['Gruntfile.js', '<%= dir.script  %>/**/*.js']
    }
};