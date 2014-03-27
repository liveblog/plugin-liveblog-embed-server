'use strict';
define([
    'underscore',
    'core/utils',
    'views/base-view',
    'views/post',
    'tmpl!themeBase/posts-list'
], function(_, utils, BaseView, PostView) {

    return BaseView.extend({
        // Set el to the top level element from the template
        // instead of default behaviour of inserting a div element.
        el: false,

        // The selector of the view root element
        rootSel: '[data-gimme="posts.list"]',

        // Data attribute that identifies post view elements
        postRootDataAttr: 'data-gimme-postid',

        // The selector of a certain post view root element
        postRootSel: function(postId) {
            if (postId) {
                return '[' + this.postRootDataAttr + '="' + postId + '"]';
            } else {
                return '[' + this.postRootDataAttr + ']';
            }
        },

        syncParams: {
            thumbSize: 'medium'
        },

        flags: {
            autoRender: true
        },

        initialize: function() {
            utils.dispatcher.trigger('initialize.posts-view', this);
            this.setTemplate('themeBase/posts-list');
            if (utils.isClient) {
                this.listenTo(this.collection, 'reset', this.render);
                this.listenTo(this.collection, 'add', this.addPost);
                this.listenTo(this.collection, 'remove', this.removePost);
            }
            this.collection.fetch({reset: true});
        },

        beforeRender: function(manage) {
            this.collection.forEach(this.insertPostView, this);
        },

        afterRender: function() {
            utils.dispatcher.trigger('after-render.posts-view', this);
        },

        // Create a new post view and insert it at the end of the views array
        insertPostView: function(post) {
            var postView = new PostView({model: post});
            this.insertView(this.rootSel, postView);
            return postView;
        },

        addPost: function(post) {
            var postView = this.insertPostView(post);
            // Reorder the views array before rendering the new view
            this.views[this.rootSel] = _.sortBy(this.views[this.rootSel],
                                                'order').reverse();
            postView.render();
        },

        removePost: function(post) {
            var self = this;
            this.removeView(function(nestedView) {
                if (nestedView.$el.is(self.postRootSel(post.id))) {
                    return nestedView;
                }
            });
        },

        // Override Backbone.LayoutManager to insert new posts in the right position
        insert: function($root, $el) {
            // Append the first posts (reset or backend posts rendering) to the view element
            if ($root.is(':empty')) {
                $root.append($el);
            // For posts added in sucessive updates (addPost)
            } else {
                // Find the index where the new post view should be inserted
                var orderedIds = this.views[this.rootSel].map(function(v) {
                                        return v.model.id;
                                    });
                var i = _.indexOf(orderedIds, $el.attr(this.postRootDataAttr));
                // If it's not the first place, find the previous post el
                // by postId and add it after it
                if (i > 0) {
                    var prevId = this.views[this.rootSel][i - 1].model.id;
                    $root.children(this.postRootSel(prevId)).after($el);
                } else {
                    $root.children(this.postRootSel()).first().before($el);
                }
            }
        }
    });

});
