'use strict';

var requirejs = require('requirejs'),
    express   = require('express'),
    dust      = require('dustjs-linkedin'),
    path      = require('path'),
    fs        = require('fs'),
    qs        = require('qs'),
    Logger    = require('./core/logger'),
    lodash    = require('lodash');

var app = module.exports = express(),
    paths = {
        app: '../../../'
    };
paths.guiThemes = paths.app + 'gui-themes';
paths.guiResources = paths.app + 'gui-resources';
paths.themes = paths.guiThemes + '/themes';
paths.node_modules = paths.app + 'node_modules';

var config = JSON.parse(fs.readFileSync(path.join(__dirname, paths.app, 'config.json')));

app.configure(function() {
    app.set('port', process.env.PORT || config.server.port);
    app.use(express['static'](path.join(__dirname, paths.guiResources)));
    app.use(express['static'](path.join(__dirname, paths.guiThemes)));
    app.use('/scripts/js/node_modules',
                express['static'](path.join(__dirname, paths.node_modules)));
});

paths.logs = path.join(__dirname, paths.app, config.dir.log);

// Create logger for the app
fs.exists(paths.logs, function(exists) {
    if (exists) {
        var logFile = fs.createWriteStream(path.join(paths.logs, config.logging.app),
                                            {'flags': 'a'});
        GLOBAL.liveblogLogger = new Logger('info', logFile);
    } else {
        console.log(paths.log + ' folder missing, to create it run ' +
                        '"grunt create-logs-folder" or "grunt server"');
    }
});

requirejs.config({
    baseUrl: __dirname,
    config: {
        'createBlogView': {
            themesPath: path.join(__dirname, paths.themes) + '/'
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

requirejs([
    'models/blog',
    'createBlogView',
    'tmpl!index'
], function(Blog, createBlogView) {

    var configLiveblog = function(config) {
        if (config.host) {
            var authority,
                host = config.host,
                hostParts = host.toLowerCase().match(/((http:|https:)?\/\/)([^/?#]*)/);
            if (hostParts) {
                if(hostParts[1] !== '//') {
                    config.protocol = hostParts[1];
                }
                authority = hostParts[3];
            } else {
                authority = host;
            }
            if (authority.indexOf(':') !== -1) {
                var authorityParts = authority.split(':');
                config.hostname = authorityParts[0];
                config.port = authorityParts[1];
            } else {
                config.hostname = authority;
                delete config.port;
            }

        }
        config.host = config.protocol + config.hostname + (config.port ? (':' + config.port) : '');
        requirejs.config({
            config: {
                    css: {
                        host: '//' + config.hostname + (config.port ? (':' + config.port) : '') + '/content/lib/livedesk-embed'
                    }
                }
            });
        return config;
    };

    app.get('/', function(req, res) {

        var queryString = qs.stringify(req.query);
        liveblogLogger.info('App request query string' +
            (queryString ? ': "' + queryString + '"' : ' is empty'));

        // override the default configuration parameters with
        // the GET query given ones if there are any.
        GLOBAL.liveblog = configLiveblog(lodash.extend(
                            lodash.clone(config.app),
                            req.query));

        requirejs(['i18n!livedesk_embed'], function() {

            var blogView,
                blog = new Blog({id: liveblog.id});

            var renderBlog = function() {
                var html = blogView.render().$el.html();
                var ctx = {
                    'liveblog': liveblog,
                    'content': function(chunk) {
                        return chunk.map(function(chunk) {
                            chunk.end(html);
                        });
                    }
                };

                dust.render('index', ctx, function(err, out) {
                    res.send(out);
                });
            };

            var fetchPosts = function(view) {
                blogView = view;
                blogView.model.get('publishedPosts').fetch({success: renderBlog});
            };

            blog.fetch({success: function() {
                createBlogView(blog, fetchPosts);
            }});
        });
    });
});
