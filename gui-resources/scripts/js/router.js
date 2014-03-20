'use strict';
define([
    'backbone-custom',
    'models/blog',
    'createBlogView'
], function(Backbone, Blog, createBlogView) {
    return Backbone.Router.extend({
        'routes': {
            '*path': 'default'
        },
        'default': function(path) {
            // TODO: Throw error if blog id missing
            if (liveblog.id) {
                var blogView,
                    blog = new Blog({id: liveblog.id});

                var renderBlog = function(view) {
                    blogView = view;
                    blogView.render();
                    blog.get('publishedPosts').fetch();
                };

                blog.fetch({success: function() {
                    createBlogView(blog, renderBlog, {el: '#here'});
                }});
            }
        }
    });
});
