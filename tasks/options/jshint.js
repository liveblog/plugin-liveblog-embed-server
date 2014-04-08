module.exports = {
    options: {
        // When using a jshintrc file the
        // options can't be overwritten at task level
        jshintrc: true,
        ignores: ['<%= paths.script  %>/bower_components/**']
    },
    source: {
        src: [
            '<%= paths.script  %>/**/*.js',
            '<%= paths.theme  %>/**/*.js'
        ]
    },
    tests: {
        src: [
            '<%= paths.test %>/**/*.js'
        ]
    },
    grunt: {
        src: [
            'Gruntfile.js'
        ]
    },
    all: {
        src: [
            'Gruntfile.js',
            'tasks/**/*.js',
            '<%= paths.script  %>/**/*.js',
            '<%= paths.theme  %>/**/*.js',
            '<%= paths.test %>/**/*.js'
        ]
    }
};
