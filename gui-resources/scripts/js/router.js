'use strict';
define([
    'backboneCustom',
    'models/blog',
    'createBlogView'
], function(Backbone, Blog, createBlogView) {
    return Backbone.Router.extend({
        'routes': {
            '*path': 'default'
        },
        'default': function(path) {
            // TODO: Throw error if blog id missing
            // TODO: remove the next lines, this should come from the config
            liveblog.id = 1;
            liveblog.theme = 'zeit';

            if (liveblog.id) {
                var blogView,
                    blog = new Blog({ id: liveblog.id });

                var renderBlog = function(view) {
                    blogView = view;
                    blogView.render();
                    blog.get('publishedPosts').fetch();
                };

                createBlogView(blog, renderBlog, { el: '#here' });
            }
        }
    });
});
