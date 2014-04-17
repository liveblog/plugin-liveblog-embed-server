module.exports = {
    options: {
        config: '.jscsrc',
        excludeFiles:  ['node_modules/**', '<%= dir.script  %>/bower_components/**']
    },
    all: {
        src: ['<%= jshint.all.src %>']
    }
};
