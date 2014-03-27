'use strict';

define([
    'collections/base-collection',
    'models/post',
    'core/utils'
], function(BaseCollection, Post, utils) {

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
            }
        },

        pollInterval: 10000,

        url: function() {
            return liveblog.host + '/resources/LiveDesk/Blog/' + this.blogId + '/Post/Published/';
        },

        initialize: function(models, options) {
            if (options.blogId) {
                this.blogId = options.blogId;
            }
            // if (utils.isClient) {
            //     this.startPolling();
            // }
        },

        parse: function(data) {
            this.filterParams.lastCId = parseInt(data.lastCId, 10);
            this.filterParams.offset  = parseInt(data.offset, 10);
            this.filterParams.total   = parseInt(data.total, 10);
            this.filterParams.limit   = parseInt(data.limit, 10);
            delete data.offsetMore;

            if (data.PostList) {
                return data.PostList;
            } else {
                delete data.lastCId;
                delete data.offset;
                delete data.total;
                delete data.limit;
                return data;
            }
        }
    });
});
