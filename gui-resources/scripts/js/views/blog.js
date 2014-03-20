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
            //When the model changes, update the view
            this.listenTo(this.model, 'change', this.update);
            this.insertView('.liveblog-postlist', new PostsView({collection: collection}));
        },
        afterRender: function() {
            //We need to update the view after first render
            this.update();
            utils.dispatcher.trigger('after-render.blog-view', this);
        },
        beforeRender: function() {

            utils.dispatcher.trigger('before-render.blog-view', this);
        },
        update: function() {
            var embedConfig = {};
            //EmbedConfig may be a string instead of JSON
            embedConfig = this.model.get('EmbedConfig');
            try {
                embedConfig = JSON.parse(embedConfig);
            } catch (e){
                //handle it
            }
            //Show or hide the entire advertisment
            if (typeof(embedConfig.MediaToggle) !== 'undefined') {
                if (embedConfig.MediaToggle) {
                    this.$('[data-gimme="blog.media-toggle"]').css('display', 'block');
                } else {
                    this.$('[data-gimme="blog.media-toggle"]').css('display', 'none');
                }
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
