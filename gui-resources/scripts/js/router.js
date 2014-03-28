'use strict';
define([
    'backbone-custom',
    'views/blog',
    'models/blog',
    'load-theme'
], function(Backbone, BlogView, Blog, loadTheme) {
    return Backbone.Router.extend({
        'routes': {
            '*path': 'default'
        },
        'default': function(path) {
            // TODO: Throw error if blog id missing
            if (liveblog.id) {
                var blog = new Blog({Id: liveblog.id});
                blog.fetch({success: function() {
                    loadTheme(blog.get('EmbedConfig'), function() {
                        /* jshint unused: false */
                        var blogView = new BlogView({el: '[data-gimme="liveblog-layout"]', model: blog});
                        blogView.conditionalRender();
                    });
                }});
            }
        }
    });
});
