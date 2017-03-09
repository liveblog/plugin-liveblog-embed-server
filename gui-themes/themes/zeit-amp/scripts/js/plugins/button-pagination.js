'use strict';
define([
    'backbone',
    'plugins',
    'plugins/pagination',
    'dust',
    'lib/utils',
    'tmpl!themeBase/plugins/after-button-pagination',
    'tmpl!themeBase/plugins/before-button-pagination'
], function(Backbone, plugins, paginationPlugin, dust, utils) {
    delete plugins.pagination;
    plugins['button-pagination'] = function(config) {
        paginationPlugin(config);

        utils.dispatcher.once('add-all.posts-view', function(view) {
            var data = {};

            dust.renderThemed('themeBase/plugins/before-button-pagination', data, function(err, out) {
                view.$el.prepend(Backbone.$(out));
            });

            if (view.hasNextPage()) {
                var lastOrder = parseFloat(view.collection.models[view.collection.models.length - 1].get('Order'));
                data.lastPermalink = '?liveblog.item.id=' + lastOrder + '#livedesk-root';
                dust.renderThemed('themeBase/plugins/after-button-pagination', data, function(err, out) {
                    view.$el.append(Backbone.$(out));
                });
            }
        });
    };
    return plugins['button-pagination'];
});
