/* jshint maxparams: 9 */
'use strict';
define([
    'views/base-view',
    'views/blog',
    'views/embed-code',
    'models/blog',
    'load-theme',
    'lib/utils',
    'tmpl!layout'
], function(BaseView, BlogView, EmbedCode, Blog, loadTheme, utils) {

    return BaseView.extend({

        initialize: function() {
            var self = this;
            utils.dispatcher.trigger('initialize.layout-view', this);
            this.model = new Blog({Id: liveblog.id});
            this.model.fetch({success: function() {
                loadTheme(self.model.get('EmbedConfig'), function() {
                    self.insertView('#liveblog-layout', new BlogView({model: self.model}));
                });
            }});
            self.insertView('#liveblog-embed-code', new EmbedCode());
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
