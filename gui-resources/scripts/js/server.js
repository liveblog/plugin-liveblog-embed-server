'use strict';
var app, dust, express, request, requirejs;

requirejs = require('requirejs');

express = require('express');

dust = require('dustjs-linkedin');

request = require('request');

app = express();

app.configure(function() {
    return app.use(express['static'](__dirname + '/..'));
});

requirejs.config({
    paths: {
        templates: '../templates'
    },
    packages: [
        {
            name: 'text',
            location: '../node_modules/text',
            main: 'text.js'
        }
    ],
    nodeRequire: require
});

requirejs(['models/blog', 'collections/posts', 'text!templates/blog.tmpl', 'text!templates/base.tmpl', 'appConfig'], function(Blog, Posts, BlogTmpl, BaseTmpl, AppConfig) {
    var objects, port;
    objects = {
        blog: new Blog()
    };
    dust.loadSource(dust.compile(BaseTmpl, 'base'));
    /*jshint maxcomplexity:false */
    app.get('/', function(req, res) {
        return request(AppConfig.LIVEBLOG_URL, function(error, response, data) {
            var context;
            if (!error && response.statusCode === 200) {
                objects.posts = new Posts(JSON.parse(data), {
                    parse: true
                });
                context = {
                    'notice': 'This was rendered from the backend',
                    'length': objects.posts.length,
                    'posts': objects.posts.toJSON(),
                    'post': function(chunk, context, bodies) {
                        return chunk.map(function(chunk) {
                            return chunk.render(bodies.block, context).end();
                        });
                    }
                };
                dust.loadSource(dust.compile(BlogTmpl, 'blog'));
                return dust.render('blog', context, function(err, out) {
                    return res.send(out);
                });
            }
        });
    });
    port = 3000;
    return app.listen(port, function() {
        return console.log('Listening on port %d', port);
    });
});