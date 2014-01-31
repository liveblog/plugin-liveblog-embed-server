'use strict';
define([
    'backbone',
    'dust',
    'collections/posts',
    'views/blog',
    'text!themes/base/base.tmpl'], function(Backbone, dust, Posts, BlogView, baseTmpl) {
    return Backbone.Router.extend({
        'routes': {
            '*path': 'default'
        },
        'initialize': function() {
            dust.loadSource(dust.compile(baseTmpl, 'base'));
        },
        'default': function(path) {
            var posts = new Posts();
            var blogView = new BlogView({
                collection: posts,
                el: '.liveblog'
            });
            posts.fetch();
        }
    });
});
