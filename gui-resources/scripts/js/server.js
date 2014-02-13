'use strict';

var requirejs = require('requirejs'),
    express = require('express'),
    request = require('request');

var app = express();

app.configure(function() {
    app.use(express['static'](__dirname + '/../../..'));
});

requirejs.config({
    paths: {
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
        'models/blog',
        'collections/posts',
        'views/blog',
        'views/post_baseTemplates',
        'views/post_templates',
        'tmpl!themeBase/container',
        'tmpl!theme/container'
    ], function(Blog, Posts, BlogView) {


        var objects = {
            blog: new Blog(),
            posts: new Posts()
        };

        /*jshint maxcomplexity:false */
        app.get('/', function(req, res) {
            var options = {
                url: liveblog.app.url,
                headers: objects.posts.headers
            };
            request(options, function(error, response, data) {
                if (!error && response.statusCode === 200) {
                    objects.posts = new Posts(JSON.parse(data), { parse: true });
                    objects.blog.set('publishedPosts', objects.posts);

                    objects.blogView = new BlogView({ model: objects.blog });
                    res.send(objects.blogView.render().$el.html());

                } else {
                    console.log('Error in request: ' + error);
                }
            });
        });

        var port = 3000;
        app.listen(port, function() {
            console.log('Listening on port %d', port);
        });
    });
});
