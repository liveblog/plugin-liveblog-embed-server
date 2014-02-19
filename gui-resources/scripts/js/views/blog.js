/* jshint maxcomplexity: false */
define([
    'models/blog',
    'views/baseView',
    'views/posts',
    'tmpl!theme/container'
], function(Blog, BaseView, PostsView) {
    'use strict';

    return BaseView.extend({
        template: 'theme/container',

        initialize: function(){
            // TODO: Throw error if blog id missing
            if (liveblog.id) {
                this.model = new Blog({ id: liveblog.id });
                var collection = this.model.get('publishedPosts');
                this.setView('.liveblog-postlist', new PostsView({ collection: collection }));
            }
        },

        serialize: function(){
            return this.model.toJSON();
        }
    });
});
