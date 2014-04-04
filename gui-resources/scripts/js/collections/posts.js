'use strict';

define([
    'underscore',
    'collections/base-collection',
    'models/post',
    'lib/utils'
], function(_, BaseCollection, Post, utils) {

    return BaseCollection.extend({

        model: Post,

        syncParams: {
            headers: {
                'X-Filter': 'PublishedOn, DeletedOn, Order, Id, ' +
                            'CId, Content, CreatedOn, Type, ' +
                            'AuthorName, Author.Source.Name, ' +
                            'Author.Source.IsModifiable, ' +
                            'AuthorImage, Meta, ' +
                            'IsPublished, Creator.FullName, Author.Source.Type.Key'
            },
            data: {
                thumbSize: 'medium'
            },
            pagination: {},
            updates: {}
        },

        pollInterval: 10000,

        url: function() {
            return liveblog.host + '/resources/LiveDesk/Blog/' + this.blogId + '/Post/Published/';
        },

        initialize: function(models, options) {
            if (options.blogId) {
                this.blogId = options.blogId;
            }
            // Cache the min 'Order' value between the collection posts
            this.minPostOrder = 0;

            if (utils.isClient) {
                this.startPolling();
            }
        },

        parse: function(data, options) {
            if (!_.isUndefined(options.data['cId.since'])) {
                data.PostList = this.updateDataParse(data, options);
            } else {
                data.PostList = this.newPageDataParse(data, options);
            }
            return data.PostList;
        },

        updateDataParse: function(data, options) {
            this.updateLastCId(data.lastCId);

            // Filter updates of posts: remove post updates from following pages
            if (data.PostList.length) {
                var self = this;
                data.PostList = data.PostList.filter(function(p) {
                    if(p.Order) {
                        return parseFloat(p.Order) >= self.minPostOrder;
                    }
                    return true;
                });
            }

            return data.PostList;
        },

        newPageDataParse: function(data, options) {
            // A page request response only contains data of posts between
            // offset and offset + limit. If the changes corresponding to the
            // new cId are outside this range the API won't include them here.
            // To get the changes we need to request the updates from the old lastCId.
            // Therefore set lastCId only if it's yet undefined.
            if (_.isUndefined(this.filterParams.lastCId)) {
                this.updateLastCId(data.lastCId);
            }

            this.filterParams.offset  = parseInt(data.offset, 10);
            this.filterParams.total   = parseInt(data.total, 10);

            if (data.PostList.length) {
                var minOrderPost = _.min(data.PostList, function(p) {
                                        return parseFloat(p.Order);
                                    });
                this.minPostOrder = parseFloat(minOrderPost.Order);
            }

            return data.PostList;
        },

        updateLastCId: function(lastCId) {
            if (!_.isNumber(lastCId)) {
                lastCId = parseInt(lastCId, 10);
            }
            this.filterParams.lastCId = lastCId;
            this.syncParams.updates['cId.since'] = lastCId;
        }
    });
});
