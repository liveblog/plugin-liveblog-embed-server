'use strict';
define([
    'views/baseView',
    'views/posts',
    'tmpl!themeBase/container'
], function(BaseView, PostsView) {

    return BaseView.extend({

        initialize: function() {
            this.setTemplate('container');

            var collection = this.model.get('publishedPosts');
            this.setView('.liveblog-postlist', new PostsView({ collection: collection }));
        },

        serialize: function() {
            return this.model.toJSON();
        }
    });
});
