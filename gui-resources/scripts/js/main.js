'use strict';
require.config({
    baseUrl: '/scripts/js/',
    config: {
        'createBlogView': {
            themesPath:             '../../themes/'
        }
    },
    paths: {
        jquery:                     'bower_components/jquery/dist/jquery.min',
        json2:                      'bower_components/json2/json2',
        dust:                       'core/dust',
        'jed':                      'node_modules/jed/jed',
        tmpl:                       'core/require/tmpl',
        'lodash.underscore':        'node_modules/lodash/dist/lodash.underscore.min',
        backbone:                   'node_modules/backbone/backbone-min',
        backboneCustom:             'core/backbone/backboneCustom',
        'backbone.layoutmanager':   'node_modules/backbone.layoutmanager/backbone.layoutmanager',
        'dustjs-linkedin':          'node_modules/dustjs-linkedin/dist/dust-full.min',
        moment:                     'node_modules/moment/min/moment.min',
        i18n:                       'core/require/i18n',
        themeBase:                  '../../themes/base'
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
    },
    map: {
        '*': {
            'lodash': 'lodash.underscore',
            'underscore': 'lodash.underscore'
        }
    }
});

require([
    'jquery',
    'backbone'
], function($, Backbone) {
    $(function() {
        // Router can't be required before liveblog global variable is defined
        require(['router', 'i18n!livedesk_embed'], function(Router){
            /*jshint unused: false */
            var router = new Router();
            Backbone.history.start({ pushState: true });
        });
    });
});
