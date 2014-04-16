/* jshint maxparams: 9 */
'use strict';
define([
    'underscore',
    'views/base-view',
    'views/blog',
    'views/embed-code',
    'models/blog',
    'models/liveblog',
    'load-theme',
    'lib/utils',
    'tmpl!layout'
], function(_, BaseView, BlogView, EmbedCode, Blog, Liveblog, loadTheme, utils) {

    return BaseView.extend({
        // Additional options for fetching the blog model.
        //   they are merged with the success option, before fetch is send.
        fetchBlogOptions: {},

        initialize: function() {
            var self = this;
            utils.dispatcher.trigger('initialize.layout-view', this);
            if (_.isString(liveblog.render)) {
                var render = liveblog.render.split(',');
                liveblog.render = {};
                _.each(render, function(value) {
                    liveblog.render[value] = true;
                });
            }
            this.model = new Liveblog(liveblog);
            this.blogModel = new Blog({Id: liveblog.id});
            this.blogModel.fetch(_.extend({success: function() {
                loadTheme(self.blogModel.get('EmbedConfig'), function() {
                    self.insertView('[data-gimme="liveblog-layout"]', new BlogView({model: self.blogModel}));
                });
            }}, this.fetchBlogOptions));
            self.insertView('[data-gimme="liveblog-embed-code"]', new EmbedCode({model: this.model}));
            this.setTemplate('layout');
        },
        afterRender: function() {
            utils.dispatcher.trigger('after-render.layout-view', this);
        },
        beforeRender: function() {

            utils.dispatcher.trigger('before-render.layout-view', this);
        },
        serialize: function() {
            return this.model.toJSON();
        }
    });
});
