module.exports = {
    test: {
        src: ['test/**/*.js'],
        options: {
            output: 'docs/test'
        }
    },
    all: {
        name: 'Liveblog embed working on nodejs',
        src: [
            '<%= paths.scripts %>/**/*.js',
            '!<%= paths.scripts %>/bower_components/**'
        ],
        options: {
            output: 'docs/scripts'
        }
    }
};
