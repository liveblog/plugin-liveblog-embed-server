'use strict';
define([
    'views/baseView',
    'views/posts',
    'tmpl!theme/container'
], function(BaseView, PostsView) {

    return BaseView.extend({
        template: 'theme/container',

        initialize: function(){
            var collection = this.model.get('publishedPosts');
            this.setView('.liveblog-postlist', new PostsView({ collection: collection }));
        },

        serialize: function(){
            return this.model.toJSON();
        }
    });
});
