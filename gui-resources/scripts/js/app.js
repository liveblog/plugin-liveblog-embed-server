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
// Set a vector for caching on requirejs object.
requirejs.cache = {};

// This method is triggered by requirejs when a module is added,
//   so we keep all of the module id into the requirejs cache object.
requirejs.onResourceLoad = function (context, map, depArray) {
    requirejs.cache[map.id] = true;
};

// Check the require cache object for the matching pattern,
//    and if modules with the pattern are found undefine them form requirejs.
requirejs.clearCache = function(pattern) {
    var srex = new RegExp(pattern);
    lodash.each(requirejs.cache, function(value, name) {
        if (value && srex.test(name)) {
            requirejs.cache[name] = false;
            requirejs.undef(name);
        }
    });
};

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
        'lodash.compat':    paths.node_modules + '/lodash/dist/lodash.compat',
        'css':                  'lib/require/css'
    },
    map: {
        '*': {
            'underscore': 'lodash.compat',
            'lodash': 'lodash.compat'
        }
    },
    nodeRequire: require
});

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
requirejs.onError = function(err) {
    var failedId = err.requireModules && err.requireModules[0];
    requirejs.undef(failedId);
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
    // for requirejs to reload internationalization and css,
    //   we need to clear the theme and themeFile aswell beside i18n and css modules.
    requirejs.clearCache('^(i18n!|css!|theme|themeFile)');
    requirejs([
        'views/layout',
        'lib/utils',
        'i18n!livedesk_embed'
    ], function(Layout, utils) {
        var sended = false;
        // if this will work in the future it will be good.
        //   removeing all namespaced events.
        //utils.dispatcher.off('.request-failed');
        utils.dispatcher.off('theme-file.request-failed');
        utils.dispatcher.off('blog-model.request-failed');
        utils.dispatcher.once('blog-model.request-failed', function() {
            if (!sended) {
                sended = true;
                res.send('Request for blog has failed.');
            }
        });
        utils.dispatcher.once('theme-file.request-failed', function() {
            if (!sended) {
                sended = true;
                res.send('Request for theme file has failed.');
            }
        });
        var layout = new Layout();
        layout.blogModel.get('publishedPosts').on('sync', function() {
            if (!sended) {
                sended = true;
                res.send(layout.render().$el.html());
            }
        });
    }, function(err) {
        res.send(err);
    });
});
