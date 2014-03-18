module.exports = {
    compile: {
        options: {
            mainConfigFile: '<%= dir.script  %>/main.js',
            baseUrl: '<%= dir.script  %>/',
            name: 'main',
            out: '<%= dir.build  %>/app.min.js',
            findNestedDependencies: true
        }
    }
};
