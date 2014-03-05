'use strict';
define([
    'core/utils',
    'views/baseView',
    'views/posts',
    'tmpl!themeBase/container'
], function(Utils, BaseView, PostsView) {

    return BaseView.extend({

        initialize: function() {
            Utils.dispatcher.trigger('initialize.blog-view', this);
            this.setTemplate('container');
            var collection = this.model.get('publishedPosts');
            this.setView('.liveblog-postlist', new PostsView({ collection: collection }));
            this.initClientEvents();
        },
        afterRender: function(){

            Utils.dispatcher.trigger('after-render.blog-view', this);
        },
        beforeRender: function(){

            Utils.dispatcher.trigger('before-render.blog-view', this);
        },
        serialize: function() {
            return this.model.toJSON();
        }
    });
});
