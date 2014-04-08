module.exports = {
    options: {
        config: '.jscsrc',
        excludeFiles:  ['node_modules/**', '<%= paths.script  %>/bower_components/**']
    },
    all: {
        src: ['<%= jshint.all.src %>']
    }
};
