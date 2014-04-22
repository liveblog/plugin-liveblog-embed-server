module.exports = {
    options: {
        configFile: '<%= paths.test %>/client/karma.conf.js',
        browsers: ['Chrome']
    },
    dev: {
        reporters: 'dots'
    },
    ci: {
        singleRun: true,
        browsers: ['PhantomJS']
    },
    once: {
        singleRun: true
    }
};
