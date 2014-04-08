module.exports = {
    compile: {
        options: {
            mainConfigFile: '<%= paths.script  %>/main.js',
            baseUrl: '<%= paths.script  %>/',
            name: 'main',
            out: '<%= paths.build  %>/app.min.js',
            findNestedDependencies: true
        }
    }
};
