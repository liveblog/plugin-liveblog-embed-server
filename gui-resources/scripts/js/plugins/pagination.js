'use strict';

define([
    'plugins',
    'lib/utils'
], function(plugins, utils) {
    plugins.pagination = function(config) {
        utils.dispatcher.once('initialize.posts-view', function(view) {

            // Set pagination params
            view.collection.clearPaginationParams();
            if (liveblog.limit) {
                view.collection.syncParams.pagination.limit = parseInt(liveblog.limit, 10);
            }

            view.flags.loadingNextPage = false;

            view.topPage = function() {
                view.collection.clearPaginationParams();
                delete view.collection.syncParams.pagination['order.end'];
                return view.collection.fetchPage();
            };

            view.nextPage = function() {
                if (view.flags.loadingNextPage || !view.hasNextPage()) {
                    return;
                }
                utils.dispatcher.trigger('loading.posts-view', view);
                view.flags.loadingNextPage = true;

                var options = {
                    data: {
                        offset: view.collection.syncParams.pagination.offset + view.collection.syncParams.pagination.limit
                    }
                };

                return view.collection.fetchPage(options).done(function(data) {
                    view.flags.loadingNextPage = false;
                    utils.dispatcher.trigger('loaded.posts-view', view);
                });
            };

            view.hasNextPage = function() {
                return view.collection.length < view.collection.filterProps.total;
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
