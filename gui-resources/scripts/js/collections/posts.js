'use strict';
define(['backbone', 'models/post'], function(Backbone, Post) {
    return Backbone.Collection.extend({
        model: Post,
        url: liveblog.app.url,
        parse: function(data) {
            return data.PostList;
        }
    });
});