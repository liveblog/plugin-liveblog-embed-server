/* global requirejs */
define([
    'module',
    'underscore',
    'views/blog',
    'plugins'
], function(module, _, blogViewDef, plugins ) {
    'use strict';

    // Set theme and theme file paths.
    // Once the paths are correctly set, load the files,
    //  create the blogView and use it as param for the callback function.
    return function(blog, callback, viewOptions) {

        function core(){
            _.each(plugins, function(fn){
                fn(blog.get('EmbedConfig'));
            });
            var BlogView = blogViewDef(),
                blogView = new BlogView(viewOptions);
            callback(blogView);
        }

        // Prepare options for view creation
        viewOptions = viewOptions || {};
        viewOptions = _.extend(viewOptions, { model: blog });

        // Set liveblog theme
        var embedConfig = blog.get('EmbedConfig');
        liveblog.theme = liveblog.theme ? liveblog.theme : embedConfig.theme;

        // Set the path for theme template files and theme config file
        requirejs.config({
            paths: {
                theme: module.config().themesPath + liveblog.theme,
                themeFile: module.config().themesPath + liveblog.theme
            }
        });

        // Load (apply) theme config
        requirejs([
            'themeFile',
            'core/utils/find-environment'
        ], function(theme, findEnvironment) {
            // If the theme has different environments reset the
            //  path to theme template files and theme config file to use
            //  the ones for the selected environment
            if (theme && theme.environments) {
                if (!liveblog.environment) {
                    var environment = findEnvironment();
                    liveblog.environment = theme.environments[environment] ?
                        theme.environments[environment] : theme.environments['default'];
                }
                requirejs.undef('theme');
                requirejs.undef('themeFile');
                requirejs.config({
                    paths: {
                        theme: module.config().themesPath + liveblog.theme + '/' + liveblog.environment,
                        themeFile: module.config().themesPath + liveblog.theme + '/' + liveblog.environment
                    }
                });
                requirejs(['themeFile'], function() {
                    core();
                });
            } else {
                core();
            }
        });
    };
});
