'use strict';
define([
    'core/utils',
    'views/baseView',
    'views/posts',
    'tmpl!themeBase/container'
], function(Utils, BaseView, postsViewDef) {

    return function(){

        var PostsView = postsViewDef(),
            BlogView = BaseView.extend({
                domEvents: {},
                initialize: function() {
                    this.setTemplate('container');
                    var collection = this.model.get('publishedPosts');
                    this.setView('.liveblog-postlist', new PostsView({ collection: collection }));
                    BlogView.__super__.initialize.call(this);
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
        Utils.dispatcher.trigger('class.blog-view', BlogView.prototype);
        return BlogView;
    };
});
