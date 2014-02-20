'use strict';
define([
    'backboneCustom',
    'collections/posts'
], function(Backbone, Posts) {
    return Backbone.Model.extend({
        xfilter: 'Description, Title, EmbedConfig, Language.Code',
        url: function(){
            return liveblog.host + '/resources/LiveDesk/Blog/';
        },

        initialize: function() {
            this.set('publishedPosts', new Posts([], { blogId: this.id }));
        }
    });
});
