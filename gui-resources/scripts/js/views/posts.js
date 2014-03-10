'use strict';
define([
    'core/utils',
    'views/baseView',
    'views/post'
], function(utils, BaseView, PostView) {

    return BaseView.extend({

        syncParams: {
            thumbSize: 'medium'
        },

        initialize: function() {
            utils.dispatcher.trigger('initialize.posts-view', this);
            this.listenTo(this.collection, 'reset', this.render);
            this.listenTo(this.collection, 'sync', this.render);
            this.listenTo(this.collection, 'change', this.render);
        },

        beforeRender: function(manage){
            this.collection.forEach(this.renderPost, this);
        },

        afterRender: function(){
            utils.dispatcher.trigger('after-render.posts-view',this);
        },
        renderPost: function(post){
            var postView = new PostView({ model: post });
            this.insertView(postView);
        }
    });

});
