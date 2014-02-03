'use strict';
require.config({
    paths: {
        jquery: 'bower_components/jquery/jquery.min',
        underscore: '../../../node_modules/lodash/dist/lodash.min',
        backbone: '../../../node_modules/backbone/backbone-min',
        dust: '../../../node_modules/dustjs-linkedin/dist/dust-full.min',
        text: '../../../node_modules/text/text',
        themes: '../../../gui-themes'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
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
            new Router();
            Backbone.history.start({ pushState: true });
        });
    });
});
