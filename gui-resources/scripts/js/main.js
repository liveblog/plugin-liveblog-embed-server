'use strict';
require.config({
    baseUrl: '/scripts/js/',
    paths: {
        jquery:                     'bower_components/jquery/jquery.min',
        json2:                      'bower_components/json2/json2',
        dust:                       'core/dust/core',
        tmpl:                       'core/require/tmpl',
        underscore:                 'node_modules/lodash/dist/lodash.min',
        backbone:                   'node_modules/backbone/backbone-min',
        'backbone.layoutmanager':   'node_modules/backbone.layoutmanager/backbone.layoutmanager',
        'dustjs-linkedin':          'node_modules/dustjs-linkedin/dist/dust-full.min',
        moment:                     'node_modules/moment/min/moment.min',
        themeBase:                  '../../themes/base',
        theme:                      '../../themes/zeit/desktop'
    },
    shim: {
        json2: {
            exports: 'JSON'
        },
        backbone: {
            deps: ['underscore', 'jquery', 'json2'],
            exports: 'Backbone'
        },
        'dustjs-linkedin': {
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
