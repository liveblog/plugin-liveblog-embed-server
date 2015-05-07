'use strict';
define([
    'underscore',
    'backbone-custom',
    'views/blog',
    'models/blog',
    'load-theme',
    'models/user'
], function(_, Backbone, BlogView, Blog, loadTheme, User) {
    return Backbone.Router.extend({
        'routes': {
            '*path': 'default'
        },
        'default': function(path) {
            // TODO: Throw error if blog id missing
            if (liveblog.id) {
                var blog = new Blog({_id: liveblog.id});
                blog.fetch({success: function() {
                    var config = blog.get('meta');
                    if (_.has(blog.get('Language'), 'Code')) {
                        config.language = blog.get('Language').Code;
                    }
                    loadTheme(config, function() {
                        var blogView,
                            blogViewSel = '[data-gimme="blog.view"]',
                            blogViewRootEl = Backbone.$(blogViewSel);
                        if (blogViewRootEl.length !== 0) {
                            blogView = new BlogView({el: blogViewSel, model: blog});
                        } else {
                            blogView = new BlogView({el: liveblog.el, model: blog});
                        }
                        blogView.conditionalRender();
                    });
                }});
            }
        }
    });
});
