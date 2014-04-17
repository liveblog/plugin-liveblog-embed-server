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
            '<%= dir.test %>/server/spechelper.js',
            '<%= dir.test %>/server/**/*.spec.js'
        ]
    }
};
