'use strict';
define([
    'backbone',
    'collections/posts'
], function(Backbone, Posts) {
    return Backbone.Model.extend({
        defaults: {
            publishedPosts: new Posts()
        }
    });
});
