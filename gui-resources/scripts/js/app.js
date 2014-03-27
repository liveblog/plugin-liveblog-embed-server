'use strict';

var requirejs = require('requirejs'),
    express   = require('express'),
    path      = require('path'),
    fs        = require('fs'),
    qs        = require('qs'),
    Logger    = require('./lib/logger'),
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
        'load-theme': {
            themesPath: path.join(__dirname, paths.themes) + '/'
        },
        'css': {
            siteRoot: paths.guiThemes
        }
    },
    paths: {
        'backbone-custom':         'lib/backbone/backbone-custom',
        layout:                  '../../layout',
        'embed-code':           '../../embed-code',
        dust:                   'lib/dust',
        tmpl:                   'lib/require/tmpl',
        i18n:                   'lib/require/i18n',
        themeBase:              paths.themes + '/base',
        'lodash.underscore':    paths.node_modules + '/lodash/dist/lodash.underscore',
        'css':                  'lib/require/css'
    },
    map: {
        '*': {
            'underscore': 'lodash.underscore'
        }
    },
    nodeRequire: require
});

requirejs([
    'views/layout'
], function(Layout) {

    var configLiveblog = function(config, server) {
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
        config.frontendServer = server.protocol + server.hostname + (server.port ? (':' + server.port) : '');
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
                            req.query), config.server);
        var layout = new Layout();
        layout.model.get('publishedPosts').on('sync', function() {
            res.send(layout.render().$el.html());
        });
    });
});
