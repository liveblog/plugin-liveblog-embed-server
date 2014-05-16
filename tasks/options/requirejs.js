module.exports = {
    main: {
        paths: {
            root: '../../../'
        },
        options: {
            mainConfigFile: '<%= paths.scripts %>/main.js',
            baseUrl: '<%= paths.scripts %>/',
            name: 'main',
            out: '<%= paths.build  %>/main.js',
            paths: {
                'themeBase':                '<%= requirejs.main.paths.root %><%= paths.themes %>base',
                'dustjs-linkedin':          '<%= requirejs.main.paths.root %><%= paths.nodeModules %>dustjs-linkedin/dist/dust-full',
                'dustjs-helpers':           '<%= requirejs.main.paths.root %><%= paths.nodeModules %>dustjs-helpers/dist/dust-helpers',
                'jed':                      '<%= requirejs.main.paths.root %><%= paths.nodeModules %>jed/jed',
                'lodash.compat':            '<%= requirejs.main.paths.root %><%= paths.nodeModules %>lodash/dist/lodash.compat',
                'backbone':                 '<%= requirejs.main.paths.root %><%= paths.nodeModules %>backbone/backbone',
                'backbone.layoutmanager':   '<%= requirejs.main.paths.root %><%= paths.nodeModules %>backbone.layoutmanager/backbone.layoutmanager',
                'moment':                   '<%= requirejs.main.paths.root %><%= paths.nodeModules %>moment/moment',
                'require-lib':              '<%= requirejs.main.paths.root %><%= paths.nodeModules %>requirejs/require',
                'themeFile':                'empty:'
            },
            include: [
                'require-lib'
            ],
            findNestedDependencies: true,
            namespace: 'liveblog',
            optimize: 'none'
        }
    }
};
