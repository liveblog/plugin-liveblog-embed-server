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
        'jquery-private':           'core/jquery-private',
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
        'css':                      'core/require/css',
        'use':                      'bower_components/use-amd/use'
    },
    shim: {
        json2: {
            exports: 'JSON'
        },
        'dustjs-linkedin': {
            exports: 'dust'
        }
    },
    use: {
        jquery: {
            attach: function() {
                return $.noConflict();
            }
        },
        backbone: {
            deps: ['underscore', 'jquery', 'json2'],
            attach: function(_, $) {
                return Backbone.noConflict();
            }
        },
        'lodash.underscore': {
            attach: function() {
                return _.noConflict();
            }
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
    'use!jquery',
    'use!backbone'
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
