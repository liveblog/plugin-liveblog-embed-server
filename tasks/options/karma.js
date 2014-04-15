module.exports = {
    options: {
        configFile: '<%= dir.test %>/client/karma.conf.js',
        browsers: ['Chrome']
    },
    dev: {
        reporters: 'dots'
    }
};
