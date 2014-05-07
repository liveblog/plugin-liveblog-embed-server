'use strict';

define([
    'models/base-model',
    'collections/posts',
    'lib/utils'
], function(BaseModel, Posts, utils) {

    return BaseModel.extend({

        syncParams: {
            headers: {
                'X-Filter': 'Description, Title, EmbedConfig, Language.Code'
            },
            updates: {}
        },

        pollInterval: 10000,

        urlRoot: function() {
            return liveblog.servers.rest + '/resources/LiveDesk/Blog/';
        },

        initialize: function() {
            this.set('publishedPosts', new Posts([], {blogId: this.id}));
            if (utils.isClient) {
                this.startPolling();
            }
        },
        // The function to be called for polling
        poller: function(options) {
            delete options.data;
            this.fetch(options);
        },
        parse: function(data) {
            if (data.EmbedConfig) {
                data.EmbedConfig = JSON.parse(data.EmbedConfig);
            } else {
                data.EmbedConfig = {};
            }
            return data;
        }
    });
});
