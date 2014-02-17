'use strict';
/* jshint maxcomplexity: false */
define(['backbone', 'models/post'], function(Backbone, Post) {
    return Backbone.Collection.extend({
        model: Post,

        initialize: function(models, options){
            if (options.blogId) {
                this.blogId = options.blogId;
            }
        },

        // liveblog is a global variable set in app initialization
        url: function(){
            return liveblog.app.url + this.blogId + '/Post/Published/';
        },

        headers: {
            'X-Format-DateTime': 'yyyy-MM-ddTHH:mm:ss\'Z\'',
            'X-Filter': 'PublishedOn, DeletedOn, Order, Id, ' +
                        'CId, Content, CreatedOn, Type, ' +
                        'AuthorName, Author.Source.Name, ' +
                        'Author.Source.IsModifiable, ' +
                        'AuthorImage, Meta, ' +
                        'IsPublished, Creator.FullName, Author.Source.Type.Key'
        },

        sync: function(method, collection, options) {
            if (method === 'read') {
                options.headers = this.headers;
            }
            Backbone.sync(method, collection, options);
        },

        parse: function(data) {
            if (data.PostList) {
                return data.PostList;
            }
            return data;
        }
    });
});
