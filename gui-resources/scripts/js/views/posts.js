'use strict';
define([
    'views/baseView',
    'views/post'
], function(BaseView, PostView) {

    return BaseView.extend({
        initialize: function() {
            this.listenTo(this.collection, 'reset', this.render);
            this.listenTo(this.collection, 'sync', this.render);
            this.listenTo(this.collection, 'change', this.render);
        },

        beforeRender: function(manage){
            this.collection.forEach(this.renderPost, this);
        },

        renderPost: function(post){
            var postView = new PostView({ model: post });
            this.insertView(postView);
        }
    });
});
