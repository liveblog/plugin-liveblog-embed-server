'use strict';
define([
    'views/baseView',
    'views/posts',
    'core/utils',
    'core/utils/displayToggle',
    'underscore',
    'tmpl!themeBase/container'
], function(BaseView, PostsView, utils, displayToggle, _) {

    return BaseView.extend({

        initialize: function() {
            utils.dispatcher.trigger('initialize.blog-view', this);
            this.setTemplate('container');
            var collection = this.model.get('publishedPosts');
            //When the model changes, update the view
            this.listenTo(this.model, 'change', this.update);
            this.insertView('.liveblog-postlist', new PostsView({collection: collection}));
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
