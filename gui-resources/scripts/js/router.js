'use strict';
/* jshint maxcomplexity: false */
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
            // TODO: Throw error if blog id missing
            liveblog.id = 1;
            if (liveblog.id) {
                var blog = new Blog({ id: liveblog.id });
                var blogView = new BlogView({ model: blog, el: '#here' });
                blog.get('publishedPosts').fetch();
                blogView.render();
            }
        }
    });
});
