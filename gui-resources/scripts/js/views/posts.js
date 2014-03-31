'use strict';
define([
    'underscore',
    'lib/utils',
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
                this.listenTo(this.collection, 'change:Order', this.reorderPost);
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
            this.orderViews();
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

        reorderPost: function(post, newOrder) {
            // if more than 2 attributes has been updated (Order and CId)
            // remove the view and render it again in the right position
            if (_.size(post.changedAttributes()) > 2) {
                this.removePost(post);
                this.addPost(post);
            } else {
                // Update order attribute in view
                this.views[this.rootSel][this._postViewIndex(post.id)].order =
                                                            parseFloat(newOrder);

                // Reorder views array
                this.orderViews();

                // Detach view and insert it in new position
                var newIndex = this._postViewIndex(post.id),
                    postEl = this.$(this.postRootSel(post.id)).detach();

                this._insertPostViewAt(this.$el, postEl, newIndex);
            }
        },

        insert: function($root, $el) {
            // on 'reset' append all elements to the root element
            if ($root.is(':empty')) {
                $root.append($el);
            } else {
            // on 'add' insert the new post in the right position
                var i = this._postViewIndex($el.attr(this.postRootDataAttr));
                this._insertPostViewAt($root, $el, i);
            }
        },

        // Order the views array according to order param in views
        orderViews: function() {
            this.views[this.rootSel] = _.sortBy(this.views[this.rootSel],
                                                'order').reverse();
        },

        // Returns the index of the post view on the views array or -1
        // if the view is not in it
        _postViewIndex: function(postId) {
            var orderedIds = this.views[this.rootSel].map(function(v) {
                                    return v.model.id;
                                });
            return _.indexOf(orderedIds, postId);
        },

        // Insert post element in the parent list element at a given index
        _insertPostViewAt: function($parent, $el, i) {
            // If i it's not 0, find the previous post el by postId and add
            // it after it
            if (i > 0) {
                var prevId = this.views[this.rootSel][i - 1].model.id;
                $parent.children(this.postRootSel(prevId)).after($el);
            } else {
                $parent.children(this.postRootSel()).first().before($el);
            }
        }
    });

});
