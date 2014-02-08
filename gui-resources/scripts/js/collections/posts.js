'use strict';
define(['backbone', 'models/post'], function(Backbone, Post) {
    return Backbone.Collection.extend({
        model: Post,
        // liveblog is a global variable set in app initialization
        url: liveblog.app.url,

        parse: function(data) {
            return data.PostList;
        }
    });
});
