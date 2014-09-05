module.exports = {
    options: {
        output: 'coverage/',
        coveralls: true,
        files: [
            '<%= paths.test %>server/spechelper.js',
            '<%= paths.test %>server/**/*.spec.js'
        ]
    }
};
