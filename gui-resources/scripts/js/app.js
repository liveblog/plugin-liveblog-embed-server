'use strict';

var requirejs = require('requirejs'),
    express   = require('express'),
    path      = require('path'),
    fs        = require('fs'),
    lodash    = require('lodash');

var app = module.exports = express(),
    paths = {
        app: '../../../'
    };
paths.guiThemes = paths.app + 'gui-themes';
paths.guiResources = paths.app + 'gui-resources';
paths.themes = paths.guiThemes + '/themes';
paths.node_modules = paths.app + 'node_modules';



app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.use(express['static'](path.join(__dirname, paths.guiResources)));
    app.use(express['static'](path.join(__dirname, paths.guiThemes)));
    app.use('/scripts/js/node_modules',
                express['static'](path.join(__dirname, paths.node_modules)));
});



requirejs.config({
    config: {
        'createBlogView': {
            themesPath: path.join(__dirname,paths.themes)+'/'
        },
        'css': {
            siteRoot: paths.guiThemes
        }
    },
    paths: {
        backboneCustom:         'core/backbone/backboneCustom',
        index:                  '../../index',
        dust:                   'core/dust',
        tmpl:                   'core/require/tmpl',
        i18n:                   'core/require/i18n',
        themeBase:              paths.themes + '/base',
        underscore:             paths.node_modules + '/lodash/dist/lodash.underscore',
        'lodash.underscore':    paths.node_modules + '/lodash/dist/lodash.underscore',
        'css':                  'core/require/css'
    },
    map: {
        '*': {
            'lodash': 'lodash.underscore',
            'underscore': 'lodash.underscore'
        }
    },
    nodeRequire: require
});

var config = JSON.parse(fs.readFileSync(path.join(__dirname, paths.app, 'config.json')));

requirejs([
    'models/blog',
    'createBlogView',
    'tmpl!index'
], function(Blog, createBlogView) {

    var configLiveblog = function(config){
        if(config.host) {
            var authority,
                host = config.host,
                hostParts = host.toLowerCase().match(/((http:|https:)?\/\/)([^/?#]*)/);
            if(hostParts) {
                if(hostParts[1] !== '//') {
                    config.protocol = hostParts[1];
                }
                authority = hostParts[3];
            } else {
                authority = host;
            }
            if( authority.indexOf(':') !== -1 ) {
                var authorityParts = authority.split(':');
                config.hostname = authorityParts[0];
                config.port = authorityParts[1];
            } else {
                config.hostname = authority;
                delete config.port;
            }

        }
        config.host = config.protocol + config.hostname + (config.port? (':' + config.port) : '');
        requirejs.config({
            config: {
                    css: {
                        host: '//' + config.hostname + (config.port? (':' + config.port) : '')+'/content/lib/livedesk-embed'
                    }
                }
            });
        return config;
    };

    app.get('/', function(req, res) {

        // override the default configuration parameters with
        // the GET query given ones if there are any.
        GLOBAL.liveblog = configLiveblog(lodash.extend(
                            lodash.clone(config.app),
                            req.query));

        requirejs(['i18n!livedesk_embed'], function() {

            var blogView,
                blog = new Blog({ id: liveblog.id });

            var renderBlog = function() {
                var html = blogView.render().$el.html();
                res.send(html);
            };

            var fetchPosts = function(view) {
                blogView = view;
                blogView.model.get('publishedPosts').fetch({ success: renderBlog });
            };

            blog.fetch({ success: function() {
                createBlogView(blog, fetchPosts);
            }});
        });
    });
});
