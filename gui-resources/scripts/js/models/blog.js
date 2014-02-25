'use strict';
define([
    'backboneCustom',
    'collections/posts'
], function(Backbone, Posts) {
    return Backbone.Model.extend({
        xfilter: 'Description, Title, EmbedConfig, Language.Code',

        urlRoot: function(){
            return liveblog.host + '/resources/LiveDesk/Blog/';
        },

        initialize: function() {
            this.set('publishedPosts', new Posts([], { blogId: this.id }));
        },

        parse: function(data) {
            if (data.EmbedConfig) {
                data.EmbedConfig = JSON.parse(data.EmbedConfig);
            }
            return data;
        }
    });
});
