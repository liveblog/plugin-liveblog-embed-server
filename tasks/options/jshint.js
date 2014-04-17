module.exports = {
    options: {
        // When using a jshintrc file the
        // options can't be overwritten at task level
        jshintrc: true,
        ignores: ['<%= dir.script  %>/bower_components/**']
    },
    source: {
        src: [
            '<%= dir.script  %>/**/*.js',
            '<%= dir.theme  %>/**/*.js'
        ]
    },
    tests: {
        src: [
            '<%= dir.test %>/**/*.js'
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
            '<%= dir.script  %>/**/*.js',
            '<%= dir.theme  %>/**/*.js',
            '<%= dir.test %>/**/*.js'
        ]
    }
};
