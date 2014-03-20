'use strict';
define([
    'core/utils',
    'views/base-view',
    'views/post',
    'tmpl!themeBase/posts-list'
], function(utils, BaseView, PostView) {

    return BaseView.extend({
        // Set el to the top level element from the template
        // instead of default behaviour of inserting a div element.
        el: false,

        syncParams: {
            thumbSize: 'medium'
        },

        flags: {
            autoRender: true
        },

        initialize: function() {
            this.setTemplate('themeBase/posts-list');
            utils.dispatcher.trigger('initialize.posts-view', this);
            this.listenTo(this.collection, 'reset', this.render);
            this.listenTo(this.collection, 'sync', this.render);
            this.listenTo(this.collection, 'change', this.render);
        },

        beforeRender: function(manage) {
            this.collection.forEach(this.renderPost, this);
        },

        afterRender: function() {
            utils.dispatcher.trigger('after-render.posts-view', this);
        },

        renderPost: function(post) {
            var postView = new PostView({model: post});
            this.insertView('ul', postView);
        }
    });

});
