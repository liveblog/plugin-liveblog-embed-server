'use strict';
/*jshint maxcomplexity:false */

var requirejs = require('requirejs'),
    express   = require('express'),
    dust      = require('dustjs-linkedin'),
    path      = require('path'),
    fs        = require('fs'),
    lodash    = require('lodash');

var app = module.exports = express();

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.use(express['static'](path.join(__dirname, '..', '..', '..', 'gui-resources')));
    app.use(express['static'](path.join(__dirname, '..', '..', '..', 'gui-themes')));
    app.use('/scripts/js/node_modules',
                express['static'](path.join(__dirname, '..', '..', '..', 'node_modules')));
});

requirejs.config({
    paths: {
        backboneCustom: 'core/backbone/backboneCustom',
        index: '../../index',
        themeBase: '../../../gui-themes/themes/base',
        theme: '../../../gui-themes/themes/zeit/desktop'
    },
    map: {
        '*': {
            'dust': 'core/dust/core'
        }
    },
    packages: [
        {
            name: 'tmpl',
            location: 'core/require',
            main: 'tmpl.js'
        }
    ],
    nodeRequire: require
});

var config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', '..', 'config.json')));

requirejs([
    'models/blog',
    'views/blog',
    'tmpl!themeBase/container',
    'tmpl!index'
], function(Blog, BlogView) {

    var configLiveblog = function(config){

        var host = config.host || config.hostname;
        host = host.toLowerCase();

        // If the host was given without protocol ex: http:// or //
        //      then add the default protocol and port given in the config.
        // If the host was given with a protocol assume that is the good
        //      one (with port as well).
        if( ( host.substring(0,4) !== 'http' ) || (host.substring(0,2) === '//') ){

            // Request node pakage needs a http or https protocol default or won't work
            //  so remove the automated protocol at this step.
            if( host.substring(0,2) === '//' ) {
                host = host.substring(2);
            }
            // and the default port if there isn't any.
            if( host.indexOf(':') === -1 ) {
                host = host + ':' + config.port;
            }
            // and add the default protocol.
            host = config.protocol + host;
        }
        config.host = host;
        return config;
    };

    app.get('/', function(req, res) {

        // override the default configuration parameters with
        // the GET query given ones if there are any.
        GLOBAL.liveblog = configLiveblog(lodash.extend(
                            lodash.clone(config.rest),
                            req.query));

        var blog = new Blog({ id: liveblog.id }),
            blogView = new BlogView({ model: blog });

        var renderBlog = function(model, response, options) {
            var html = blogView.render().$el.html();

            var ctx = {
                'content': function(chunk) {
                    return chunk.map(function(chunk){
                        chunk.end(html);
                    });
                }
            };
            dust.render('index', ctx, function(err,out){
                res.send(out);
            });
        };

        blog.get('publishedPosts').fetch({ success: renderBlog });
    });
});
