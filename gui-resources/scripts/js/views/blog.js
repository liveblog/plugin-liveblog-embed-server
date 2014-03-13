'use strict';
define([
    'views/baseView',
    'views/posts',
    'core/utils',
    'tmpl!themeBase/container'
], function(BaseView, PostsView, utils) {

    return BaseView.extend({

        initialize: function() {
            utils.dispatcher.trigger('initialize.blog-view', this);
            this.setTemplate('container');
            var collection = this.model.get('publishedPosts');
            this.insertView('.liveblog-postlist', new PostsView({ collection: collection }));
            this.initClientEvents();
        },
        afterRender: function(){

            utils.dispatcher.trigger('after-render.blog-view', this);
        },
        beforeRender: function(){

            utils.dispatcher.trigger('before-render.blog-view', this);
        },
        serialize: function() {
            return this.model.toJSON();
        }
    });
});
