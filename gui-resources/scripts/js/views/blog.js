'use strict';
define([
    'views/base-view',
    'views/posts',
    'lib/utils',
    'lib/helpers/displayToggle',
    'underscore',
    'tmpl!themeBase/container'
], function(BaseView, PostsView, utils, displayToggle, _) {

    return BaseView.extend({

        el: false,

        initialize: function() {
            utils.dispatcher.trigger('initialize.blog-view', this);

            this.setTemplate('themeBase/container');

            this.listenTo(this.model, 'change', this.update);

            // When creating the PostsView, if there is server side generated HTML
            // attach the view to it
            var collection      = this.model.get('publishedPosts'),
                postsViewSel    = PostsView.prototype.rootSel,
                postsViewRootEl = this.$(postsViewSel);
            if (utils.isClient && postsViewRootEl.length !== 0) {
                var postsView = new PostsView({collection: collection, el: postsViewSel});
                this.setView('[data-gimme="posts.view"]', postsView);
            } else {
                this.setView('[data-gimme="posts.view"]', new PostsView({collection: collection}));
            }
        },
        conditionalRender: function() {
            //if the markup for the blog view is already generated, use it
            if (this.$('[data-gimme="blog.view"]').length) {
                this.el = this.$('[data-gimme="blog.view"]');
                //make sure that we updated the seo generated markup with the latest changes
                this.update();
            } else {
                this.render();
            }
        },
        afterRender: function() {
            utils.dispatcher.trigger('after-render.blog-view', this);
        },
        beforeRender: function() {
            utils.dispatcher.trigger('before-render.blog-view', this);
        },
        update: function() {
            var embedConfig = {};
            embedConfig = this.model.get('EmbedConfig');
            //Show or hide the entire advertisment
            if (!_.isUndefined(embedConfig.MediaToggle)) {
                displayToggle(this.$('[data-gimme="blog.media-toggle"]'), embedConfig.MediaToggle);
            }
            //Set the target and the image for the advertisment
            if (embedConfig.MediaUrl) {
                this.$('[data-gimme="blog.media-url"]').attr('href', embedConfig.MediaUrl);
            }
            if (embedConfig.MediaImage) {
                this.$('[data-gimme="blog.media-image"]').attr('src', embedConfig.MediaImage);
            }
            //Set title and description
            this.$('[data-gimme="blog.title"]').html(this.model.get('Title'));
            this.$('[data-gimme="blog.description"]').html(this.model.get('Description'));
        },
        serialize: function() {
            return this.model.toJSON();
        }
    });
});
