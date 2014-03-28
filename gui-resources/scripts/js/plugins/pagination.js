'use strict';

define([
    'plugins',
    'lib/utils'
], function(plugins, utils) {
    plugins.pagination = function(config) {
        utils.dispatcher.once('initialize.posts-view', function(view) {
            if (liveblog.limit) {
                view.collection.syncParams.data.limit = parseInt(liveblog.limit, 10);
            } else {
                view.collection.syncParams.data.limit = view.collection.defaultFilterParams.limit;
            }
            view.flags.loadingNextPage = false;

            view.topPage = function() {
                view.collection.clearFilterParams();
                delete view.collection.syncParams.data['order.end'];
                return view.collection.fetch();
            };

            view.nextPage = function() {
                if (view.flags.loadingNextPage || !view.hasNextPage()) {
                    return;
                }
                utils.dispatcher.trigger('loading.posts-view', view);
                view.flags.loadingNextPage = true;

                var options = {
                    data: {
                        offset: view.collection.filterParams.offset
                    }
                };
                return view.collection.fetch(options).done(function(data) {
                    view.flags.loadingNextPage = false;
                    utils.dispatcher.trigger('loaded.posts-view', view);
                });
            };

            view.hasNextPage = function() {
                return view.collection.length < view.collection.filterParams.total;
            };

            // True if the blog was accessed through a permanent link to a specific post
            // (ex: http://newspaper.de/very-important-liveblog/?liveblog=78)
            view.hasTopPage = function() {
                if (this.flags.hasTopPage) {
                    return true;
                }
                return false;
            };
        });
    };
    return plugins.pagination;
});
