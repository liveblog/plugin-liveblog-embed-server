'use strict';

define([
    'models/base-model',
    'collections/posts',
    'core/utils'
], function(BaseModel, Posts, utils) {

    return BaseModel.extend({

        syncParams: {
            headers: {
                'X-Filter': 'Description, Title, EmbedConfig, Language.Code'
            }
        },

        pollInterval: 10000,

        urlRoot: function() {
            return liveblog.host + '/resources/LiveDesk/Blog/';
        },

        initialize: function() {
            this.set('publishedPosts', new Posts([], {blogId: this.id}));
            if (utils.isClient) {
                this.startPolling();
            }
        },

        parse: function(data) {
            if (data.EmbedConfig) {
                data.EmbedConfig = JSON.parse(data.EmbedConfig);
            }
            return data;
        }
    });
});
