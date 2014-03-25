'use strict';
require.config({
    baseUrl: '/scripts/js/',
    config: {
        'createBlogView': {
            themesPath:             '../../themes/'
        },
        css: {
            host: '//' + liveblog.hostname + (liveblog.port ? (':' + liveblog.port) : '') + '/content/lib/livedesk-embed'
        }
    },
    paths: {
        'jquery':                   'bower_components/jquery/dist/jquery.min',
        'json2':                    'bower_components/json2/json2',
        'dustjs-linkedin':          'node_modules/dustjs-linkedin/dist/dust-full.min',
        'dust':                     'core/dust',
        'jed':                      'node_modules/jed/jed',
        'lodash.underscore':        'node_modules/lodash/dist/lodash.underscore.min',
        'backbone':                 'node_modules/backbone/backbone-min',
        'backboneCustom':           'core/backbone/backboneCustom',
        'backbone.layoutmanager':   'node_modules/backbone.layoutmanager/backbone.layoutmanager',
        'moment':                   'node_modules/moment/min/moment.min',
        'themeBase':                '../../themes/base',
        'tmpl':                     'core/require/tmpl',
        'i18n':                     'core/require/i18n',
        'css':                      'core/require/css'
    },
    shim: {
        json2: {
            exports: 'JSON'
        },
        'dustjs-linkedin': {
            exports: 'dust'
        }
    },
    map: {
        '*': {
            'underscore':   'core/lodash-private',
            'jquery':       'core/jquery-private',
            'backbone':     'core/backbone-private'
        },
        'core/jquery-private':   {'jquery': 'jquery'},
        'core/backbone-private': {'backbone': 'backbone'},
        'core/lodash-private':   {'lodash': 'lodash.underscore'}
    }
});

require([
    'jquery',
    'backbone'
], function($, Backbone) {
    $(function() {
        // Router can't be required before liveblog global variable is defined
        require(['router', 'i18n!livedesk_embed'], function(Router) {
            /*jshint unused: false */
            var router = new Router();
            Backbone.history.start({pushState: true});
        });
    });
});
