module.exports = {
    options: {
        globals: ['expect', '_', 'Backbone'],
        //globals: ['expect', 'sinon'],
        timeout: 3000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'dot'
    },

    all: {
        src: [
            '<%= paths.test %>/server/spechelper.js',
            '<%= paths.test %>/server/**/*.spec.js'
        ]
    }
};
