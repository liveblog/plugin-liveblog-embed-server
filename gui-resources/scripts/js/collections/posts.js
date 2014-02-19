'use strict';
/* jshint maxcomplexity: false */
define(['backboneCustom', 'models/post'], function(Backbone, Post) {
    return Backbone.Collection.extend({
        model: Post,

        xfilter: 'PublishedOn, DeletedOn, Order, Id, ' +
                    'CId, Content, CreatedOn, Type, ' +
                    'AuthorName, Author.Source.Name, ' +
                    'Author.Source.IsModifiable, ' +
                    'AuthorImage, Meta, ' +
                    'IsPublished, Creator.FullName, Author.Source.Type.Key',

        // liveblog is a global variable set in app initialization
        url: function(){
            return liveblog.app.url + this.blogId + '/Post/Published/';
        },

        initialize: function(models, options) {
            if (options.blogId) {
                this.blogId = options.blogId;
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
