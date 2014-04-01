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
            _.bindAll(this, 'insertPostView', 'orderViews', '_postViewIndex',
                            '_insertPostViewAt', '_insertPostViewAtFirstPos');
            this.setTemplate('themeBase/posts-list');
            if (utils.isClient) {
                this.listenTo(this.collection, 'reset', this.setViewOnReset);
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

        setViewOnReset: function() {
            // Set view $el element
            this.$el = this.parentView().$(this.rootSel);

            var postEls = this.$el.children(this.postRootSel());

            // If there are no server side rendered posts, render whole view
            if (postEls.length === 0) {
                this.render();
                return;
            }

            // Otherwise construct nested views from DOM
            var self = this;
            postEls.each(function(index, pEl) {
                var postEl  = self.$(pEl),
                    postId  = postEl.attr(self.postRootDataAttr),
                    postCId = postEl.data('gimme-cid').toString(),
                    post    = self.collection.get(postId);

                // If the post is still in the collection and hasn't changed
                // construct the postView and add it to nested views
                if (post && postCId === post.get('CId')) {
                    // TODO: We may need to set here postView.hasRendered = true or
                    // fire an event here for the plugins
                    var postView = self.insertPostView(post);
                    postView.$el = postEl;

                } else { // Else remove markup
                    postEl.remove();
                }
            });

            // Add new posts or posts that were removed because they had changed
            this.collection.forEach(this.addPostIfMissing, this);

            // TODO: We may need to fire an event here for the plugins
        },

        addPostIfMissing: function(post) {
            var i = this._postViewIndex(post.id);
            if (i === -1) {
                this.addPost(post);
            }
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
            // if some attribute other than Order (and CId) has changed
            // remove the view and render it again in the right position
            if (!this.onlyOrderHasChanged(post)) {
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

        // Create a new post view and insert it at the end of the views array
        insertPostView: function(post) {
            var postView = new PostView({model: post});
            this.insertView(this.rootSel, postView);
            return postView;
        },

        // Order the views array according to order param in views
        orderViews: function() {
            this.views[this.rootSel] = _.sortBy(this.views[this.rootSel],
                                                'order').reverse();
        },

        onlyOrderHasChanged: function(post) {
            return (_.size(post.changedAttributes()) > 2 &&
                post.hasChanged('CId') && post.hasChanged('Order'));
        },

        // Returns the index of the post view on the views array or -1
        // if the view is not in it
        _postViewIndex: function(postId) {
            // If there are no views yet on this.views[this.rootSel]
            if (!this.views[this.rootSel]) {
                return -1;
            }

            var orderedIds = this.views[this.rootSel].map(function(v) {
                                    return v.model.id;
                                });
            return _.indexOf(orderedIds, postId);
        },

        // Insert post element in the parent list element at a given index
        _insertPostViewAt: function($parent, $el, i) {
            if (i === 0) {
                this._insertPostViewAtFirstPos($parent, $el);
            } else if (i > 0) {
                // For adding it to a position different that the first, find
                // prev post and add it after it
                var prevId = this.views[this.rootSel][i - 1].model.id;
                $parent.children(this.postRootSel(prevId)).after($el);
            }
        },

        // Insert post element in the parent list element at first position
        _insertPostViewAtFirstPos: function($parent, $el) {
            // find the first post element and add it before it.
            var nextEl = $parent.children(this.postRootSel()).first();
            if (nextEl.length !== 0) {
                nextEl.before($el);
            } else {
                // If there is no first post search for pagination elements
                // and add it between them
                var pagEl = $parent.children('[data-gimme="posts.beforePage"]');
                if (pagEl.length !== 0) {
                    pagEl.after($el);
                } else {
                    // If there is no pagination element either, append to $parent
                    $parent.append($el);
                }
            }
        }
    });
});
