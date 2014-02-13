'use strict';
define([
    'backbone',
    'dust',
    'models/blog',
    'views/blog',
    'tmpl!themeBase/container'
], function(Backbone, dust, Blog, BlogView) {
    return Backbone.Router.extend({
        'routes': {
            '*path': 'default'
        },
        'default': function(path) {
            var blog = new Blog();
            var blogView = new BlogView({ model: blog, el: '#here' });
            blog.get('publishedPosts').fetch();
            blogView.render();
        }
    });
});
