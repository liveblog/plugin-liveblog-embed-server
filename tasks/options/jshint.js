module.exports = {
    options: {
        jshintrc: true,
        ignores: ['<%= dir.script  %>/bower_components/**']
    },
    own: {
        src: [  'Gruntfile.js',
                'tasks/**/*.js',
                '<%= dir.script  %>/**/*.js',
                '!<%= dir.script  %>/core/**/*.js',
                '<%= dir.theme  %>/**/*.js'
            ]
    },
    libs: {
        src: ['<%= dir.script  %>/core/**/*.js']
    },
    all: {
        src: [  'Gruntfile.js',
                'tasks/**/*.js',
                '<%= dir.script  %>/**/*.js',
                '<%= dir.theme  %>/**/*.js'
            ]
    }
};
