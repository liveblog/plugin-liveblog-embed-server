'use strict';
require.config({
    paths: {
        jquery: 'bower_components/jquery/jquery.min',
        lodash: '../../../node_modules/lodash/dist/lodash.min',
        backbone: '../../../node_modules/backbone/backbone-min',
        dust: '../../../node_modules/dustjs-linkedin/dist/dust-full.min',
        tmpl: 'core/require/tmpl',
        themeBase: '../../../gui-themes/themes/base',
        theme: '../../../gui-themes/themes/zeit'
    },
    shim: {
        backbone: {
            deps: ['lodash', 'jquery'],
            exports: 'Backbone'
        },
        dust: {
            exports: 'dust'
        }
    }
});

require(['jquery', 'backbone', 'appConfig'], function($, Backbone, appConfig) {
    $(function() {
        window.liveblog = appConfig.liveblog;
        // Router can't be required before liveblog global variable is defined
        require(['router'], function(Router){
            /*jshint unused: false */
            var router = new Router();
            Backbone.history.start({ pushState: true });
        });
    });
});
