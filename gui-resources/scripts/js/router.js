'use strict';
define([
    'backbone',
    'dust',
    'collections/posts',
    'views/blog',
    'tmpl!themeBase/container'
], function(Backbone, dust, Posts, BlogView) {
    return Backbone.Router.extend({
        'routes': {
            '*path': 'default'
        },
        'default': function(path) {
            var posts = new Posts();
            /*jshint unused: false */
            var blogView = new BlogView({
                collection: posts,
                el: '.liveblog'
            });
            posts.fetch();
        }
    });
});
