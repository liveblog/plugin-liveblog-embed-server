'use strict';

var requirejs = require('requirejs'),
    express   = require('express'),
    dust      = require('dustjs-linkedin'),
    path      = require('path');

var app = express();

app.configure(function() {
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

requirejs(['appConfig'], function(appConfig){

    GLOBAL.liveblog = appConfig.liveblog;

    requirejs([
        'views/blog',
        'tmpl!themeBase/container',
        'tmpl!index'
    ], function(BlogView) {

        /*jshint maxcomplexity:false */
        app.get('/', function(req, res) {
            var blogView = new BlogView();

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

            blogView.model.get('publishedPosts').fetch({ success: renderBlog });
        });

        var port = 3000;
        app.listen(port, function() {
            console.log('Listening on port %d', port);
        });
    });
});
