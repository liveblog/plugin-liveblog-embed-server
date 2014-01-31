'use strict';
define(['backbone', 'collections/posts', 'views/blog', 'text!templates/base.tmpl', 'dust'], function(Backbone, Posts, BlogView, BaseTmpl, dust) {
    return Backbone.Router.extend({
        'routes': {
            '*path': 'default'
        },
        'initialize': function() {
            return dust.loadSource(dust.compile(BaseTmpl, 'base'));
        },
        'default': function(path) {
            var blogView, posts;
            posts = new Posts();
            blogView = new BlogView({
                collection: posts,
                el: '.liveblog'
            });
            return posts.fetch();
        }
    });
});