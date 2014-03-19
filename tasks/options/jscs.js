module.exports = {
    options: {
        config: '.jscsrc',
        excludeFiles:  ['node_modules/**', '<%= dir.script  %>/bower_components/**']
    },
    own: {
        src: ['<%= jshint.own.src %>']
    },
    libs: {
        src: ['<%= jshint.libs.src %>']
    },
    all: {
        src: ['<%= jshint.all.src %>']
    }
};
