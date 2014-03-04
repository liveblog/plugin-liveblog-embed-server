'use strict';

define([
    'collections/baseCollection',
    'models/post',
    'core/utils'
], function(BaseCollection, Post, utils) {

    return BaseCollection.extend({

        model: Post,

        xfilter: 'PublishedOn, DeletedOn, Order, Id, ' +
                    'CId, Content, CreatedOn, Type, ' +
                    'AuthorName, Author.Source.Name, ' +
                    'Author.Source.IsModifiable, ' +
                    'AuthorImage, Meta, ' +
                    'IsPublished, Creator.FullName, Author.Source.Type.Key',

        pollInterval: 10000,

        url: function(){
            return liveblog.host + '/resources/LiveDesk/Blog/' + this.blogId + '/Post/Published/';
        },

        initialize: function(models, options) {
            if (options.blogId) {
                this.blogId = options.blogId;
            }
            if (utils.isClient) {
                this.startPolling();
            }
        },

        parse: function(data) {
            if (data.PostList) {
                return data.PostList;
            }
            return data;
        }
    });
});
