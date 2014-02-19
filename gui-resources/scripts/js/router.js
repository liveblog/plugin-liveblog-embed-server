'use strict';
/* jshint maxcomplexity: false */
define([
    'backboneCustom',
    'dust',
    'views/blog',
    'tmpl!themeBase/container'
], function(Backbone, dust, BlogView) {
    return Backbone.Router.extend({
        'routes': {
            '*path': 'default'
        },
        'default': function(path) {
            // TODO: Throw error if blog id missing
            liveblog.id = 1;

            var blogView = new BlogView({ el: '#here' });
            blogView.model.get('publishedPosts').fetch();
            blogView.render();
        }
    });
});
