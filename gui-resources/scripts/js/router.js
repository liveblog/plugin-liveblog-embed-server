'use strict';
define([
    'backbone',
    'dust',
    'collections/posts',
    'views/blog',
    'tmpl!themes/base/base'], function(Backbone, dust, Posts, BlogView) {
    return Backbone.Router.extend({
        'routes': {
            '*path': 'default'
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
