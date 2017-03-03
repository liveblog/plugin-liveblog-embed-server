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
            var current = view.collection.length,
                data = {};

            dust.renderThemed('themeBase/plugins/before-button-pagination', data, function(err, out) {
                    var  el = Backbone.$(out);
                    view.$el.prepend(el);
            });

            if (view.hasNextPage()) {
                // view.nextPage().done(function() {
                //     console.log( current, view.collection.models[current] );
                // });
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
