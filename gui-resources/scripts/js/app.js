'use strict';

var requirejs = require('./lib/nodejs/requirejs-clear-cache'),
    express   = require('express'),
    path      = require('path'),
    fs        = require('fs'),
    qs        = require('qs'),
    Logger    = require('./lib/logger'),
    urlHref   = require('./lib/nodejs/url-href'),
    grunt     = require('grunt'),
    lodash    = require('lodash');
var nodejsUrl,
    app = module.exports = express(),
    config = {
        paths: {
            root: '../../../'
        }
    };
config = lodash.merge(grunt.file.readJSON(path.join(__dirname, config.paths.root, 'config.json')), config);
// parse the grunt configuration style to an proper obj.
grunt.initConfig(config);

config = grunt.config.get();
// prase the nodejs property to a url object.
//   so that we can have the port, protocol and hostname for later use.
var nodejsUrl = urlHref.parseForceHref(config.servers.nodejs);
app.configure(function() {
    app.set('port', nodejsUrl.port); // maybe add this in the future process.env.PORT || nodejsUrl.port
    app.use(express['static'](path.join(__dirname, config.paths.scriptsRoot)));
    app.use(express['static'](path.join(__dirname, config.paths.themesRoot)));
    app.use('/scripts/js/node_modules',
                express['static'](path.join(__dirname, config.paths.nodeModules)));
    app.use('/docs',
                express['static'](path.join(__dirname, config.paths.docs)));
});

config.paths.logs = path.join(__dirname, config.paths.logs);

// Create logger for the app
fs.exists(config.paths.logs, function(exists) {
    if (exists) {
        var logFile = fs.createWriteStream(path.join(config.paths.logs, config.logging.nodejs),
                                            {'flags': 'a'});
        GLOBAL.liveblogLogger = new Logger('info', logFile);
    } else {
        console.log(config.paths.log + ' folder missing, to create it run ' +
                        '"grunt create-logs-folder" or "grunt server"');
    }
});

requirejs.config({
    baseUrl: __dirname,
    config: {
        'load-theme': {
            themesPath: path.join(__dirname, config.paths.themes) + '/'
        },
        'css': {
            siteRoot: config.paths.themesRoot
        }
    },
    paths: {
        'backbone-custom':      'lib/backbone/backbone-custom',
        layout:                 '../../layout',
        'embed-code':           '../../embed-code',
        dust:                   'lib/dust',
        tmpl:                   'lib/require/tmpl',
        i18n:                   'lib/require/i18n',
        themeBase:              config.paths.themes + '/base',
        'lodash.compat':        config.paths.nodeModules + '/lodash/dist/lodash.compat',
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

var configLiveblog = function(liveconfig, config) {
    if (liveconfig.servers.rest) {
        liveconfig.servers.rest = urlHref.reformatSever(liveconfig.servers.rest);
    }

    liveconfig.servers.frontend = urlHref.reformatSever(
        liveconfig.servers.frontend ?
            liveconfig.servers.frontend :
                (config.servers.proxy ?
                    config.servers.proxy :
                    config.servers.nodejs)
            );

    liveconfig.servers.css = urlHref.reformatSever(
        liveconfig.servers.css ?
            liveconfig.servers.css :
            liveconfig.servers.rest);

    var livereloadObj = urlHref.parseForceHref(liveconfig.servers.frontend);
    livereloadObj.port = config.servers.livereload;
    liveconfig.servers.livereload = urlHref.formatBrowser(livereloadObj);

    requirejs.config({
        config: {
                css: {
                    url: urlHref.reformatBrowser(liveconfig.servers.css) + (liveconfig.paths.css ? liveconfig.paths.css : '')
                }
            }
        });
    return liveconfig;
};
requirejs.onError = function(err) {
    var failedId = err.requireModules && err.requireModules[0];
    requirejs.undef(failedId);
};

app.get('/', function(req, res) {

    liveblogLogger.info('App request query string' +
        (req.query ? ': "' + qs.stringify(req.query) + '"' : ' is empty'));

    // override the default configuration parametners with
    // the GET query given ones if there are any.
    GLOBAL.liveblog = configLiveblog(lodash.merge(
                        lodash.cloneDeep(config.liveblog),
                        req.query.liveblog), config);
    if (!liveblog.servers.rest) {
        res.redirect('/docs');
    } else {
        // for requirejs to reload internationalization and css,
        //   we need to clear the theme and themeFile aswell beside i18n and css modules.
        requirejs.clearCache('^(i18n!|css!|theme|themeFile)');
        requirejs([
            'views/layout',
            'lib/utils'
        ], function(Layout, utils) {
            var sent = false;
            // if this will work in the future it will be good.
            //   removeing all namespaced events.
            //utils.dispatcher.off('.request-failed');
            utils.dispatcher.off('theme-file.request-failed');
            utils.dispatcher.off('blog-model.request-failed');
            utils.dispatcher.once('blog-model.request-failed', function() {
                if (!sent) {
                    sent = true;
                    //@TODO: see if this will fit server side, maybe we will need to send some error codes aswell.
                    res.send('Request for blog has failed.');
                }
            });
            utils.dispatcher.once('theme-file.request-failed', function() {
                if (!sent) {
                    sent = true;
                    //@TODO: see if this will fit server side, maybe we will need to send some error codes aswell.
                    res.send('Request for theme file has failed.');
                }
            });
            var layout = new Layout();
            layout.blogModel.get('publishedPosts').on('sync', function() {
                if (!sent) {
                    sent = true;
                    res.send(layout.render().$el.html());
                }
            });
        }, function(err) {
            //@TODO: see if this will fit server side, maybe we will need to send some error codes aswell.
            res.send(err);
        });
    }
});
