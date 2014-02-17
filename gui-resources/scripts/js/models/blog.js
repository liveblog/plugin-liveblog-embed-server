'use strict';
define([
    'backboneCustom',
    'collections/posts'
], function(Backbone, Posts) {
    return Backbone.Model.extend({
        xfilter: 'Description, Title, EmbedConfig, Language.Code',

        url: liveblog.app.url,

        initialize: function() {
            this.set('publishedPosts', new Posts([], { blogId: this.id }));
        }
    });
});
