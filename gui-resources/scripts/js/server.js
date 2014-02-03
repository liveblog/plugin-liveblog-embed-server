'use strict';

var requirejs = require('requirejs'),
    express = require('express'),
    dust = require('dustjs-linkedin'),
    request = require('request');

var app = express();

app.configure(function() {
    app.use(express['static'](__dirname + '/../../..'));
});

requirejs.config({
    paths: {
        themes: '../../../gui-themes'
    },
    packages: [
        {
            name: 'text',
            location: '../../../node_modules/text',
            main: 'text.js'
        }
    ],
    nodeRequire: require
});

requirejs(['appConfig'], function(appConfig){

    GLOBAL.liveblog = appConfig.liveblog;

    requirejs([
        'models/blog',
        'collections/posts',
        'text!themes/base/blog.tmpl',
        'text!themes/base/base.tmpl'
        ], function(Blog, Posts, blogTmpl, baseTmpl) {

        liveblog.objects = {
            blog: new Blog()
        };

        dust.loadSource(dust.compile(baseTmpl, 'base'));

        /*jshint maxcomplexity:false */
        app.get('/', function(req, res) {
            request(liveblog.app.url, function(error, response, data) {
                if (!error && response.statusCode === 200) {
                    liveblog.objects.posts = new Posts(JSON.parse(data), { parse: true });
                    var ctx = {
                        'notice': 'This was rendered from the backend',
                        'length': liveblog.objects.posts.length,
                        'posts': liveblog.objects.posts.toJSON(),
                        'post': function(chunk, context, bodies) {
                            return chunk.map(function(chunk) {
                                chunk.render(bodies.block, context).end();
                            });
                        }
                    };
                    dust.loadSource(dust.compile(blogTmpl, 'blog'));
                    dust.render('blog', ctx, function(err, out) {
                        if (err){
                            console.log('Error parsing template ' + err);
                        } else {
                            res.send(out);
                        }
                    });
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
