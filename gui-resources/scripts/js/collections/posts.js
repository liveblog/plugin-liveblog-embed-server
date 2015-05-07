'use strict';

define([
    'underscore',
    'collections/base-collection',
    'models/post',
    'lib/utils',
    'config/elastic-search-update-params'
], function(_, BaseCollection, Post, utils, elasticSearchUpdateParams) {

    return BaseCollection.extend({

        model: Post,

        syncParams: {
            headers: {},
            pagination: {},
            updates: {
                deleted: true
            }
        },

        pollInterval: 10000,

        url: function() {
            return liveblog.servers.rest + '/client_blogs/' + this.blogId + '/posts';
        },

        initialize: function(models, options) {
            if (options.blogId) {
                this.blogId = options.blogId;
            }
            // Cache the min 'Order' value between the collection posts.
            this.minPostOrder = 0;

            if (utils.isClient) {
                this.startPolling();
            }
        },

        // pre-parse the posts with items in a lists with items ( aka posts ).
        preparse: function(data, options) {
            var posts = [], post;
            _.each(data._items, function(packaged) {
                _.each(packaged.groups[1].refs, function(item) {
                    post = item.item;
                    post.order = packaged.order;
                    post.post_status = packaged.post_status;
                    posts.push(item.item);
                });
            });
            return posts;
        },

        parse: function(data, options) {
            data.posts = this.preparse(data, options);
            if (!_.isUndefined(options.data['since'])) {
                data.posts = this.updateDataParse(data, options);
            } else {
                data.posts = this.newPageDataParse(data, options);
            }
            return data.posts;
        },

        updateDataParse: function(data, options) {
            this.updateLastUpdated(data);
            // Filter updates of posts: remove post updates from pages not yet shown.
            if (data.posts.length) {
                var self = this;
                // @TODO: have this as an option.
                // data.posts = data.posts.filter(function(p) {
                //     if (p.order) {
                //         return parseFloat(p.order) >= self.minPostOrder;
                //     }
                //     return true;
                // });
                // Mark posts as coming from an updates request,
                // not from a new page request.
                _.each(data.posts, function(item, index) {
                    item.updateItem = true;
                });
            }
            return data.posts;
        },

        // A page request response only contains data of posts between
        // offset and offset + limit. If the changes corresponding to the
        // new _updated are outside this range the API won't include them here.
        // To get the changes we need to request the updates from the old lastUpdated.
        // Therefore set lastUpdated only if it's yet undefined.
        newPageDataParse: function(data, options) {
            if (_.isUndefined(this.lastUpdated())) {
                this.updateLastUpdated(data);
            }
            this.filterProps.total = parseInt(data._meta.total, 10);

            if (data.posts.length) {
                var minOrderPost = _.min(data.posts, function(p) {
                                        return parseFloat(p.order);
                                    });
                this.minPostOrder = parseFloat(minOrderPost.order);
            }

            return data.posts;
        },

        // This method lies here because we have to support two mechanism for now.
        // Open api which is parameter `since`,
        //     and elastic search `source.query.filtered.filter.and[1].range._updated.gt`.
        // @TODO: remove this elastic search query when `open api` is done.
        lastUpdated: function(updated) {
            if (updated) {
                this.syncParams.updates.since = updated;
                // @TODO: remove this part right here.
                var source = _.clone(elasticSearchUpdateParams);
                source.query.filtered.filter.and[1].range._updated.gt = updated;
                this.syncParams.updates.source = source;
                return this;
            } else {
                return this.syncParams.updates.since;
            }
        },

        // Get the latest _update date from posts.
        updateLastUpdated: function(data) {
            var latest, date;
            _.each(data.posts, function(post) {
                date = moment(post._updated);
                if (_.isUndefined(latest)) {
                    latest = date;
                } else if (latest.diff(date) < 0) {
                    latest = date;
                }
            });
            if (!_.isUndefined(latest)) {
                this.lastUpdated(latest.utc().format());
            }
        }
    });
});
