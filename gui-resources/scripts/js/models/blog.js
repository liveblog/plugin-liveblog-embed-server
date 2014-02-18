'use strict';
define([
    'backbone',
    'collections/posts'
], function(Backbone, Posts) {
    return Backbone.Model.extend({
        url: liveblog.app.url,

        initialize: function() {
            this.set('publishedPosts', new Posts([], { blogId: this.id }));
        }
    });
});
