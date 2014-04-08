'use strict';
define([
    'plugins',
    'lib/utils',
    'lib/helpers/visibility-toggle'
], function (plugins, utils, visibilityToggle) {
    if (utils.isClient) {
        plugins.permalink = function (config) {
            utils.dispatcher.on('initialize.post-view', function (view) {
                view.clientEvents({
                    'click [data-gimme="post.permalink"]': 'permalinkAction'
                });
                view.permalinkAction = function (evt) {
                    evt.preventDefault();
                    var box = this.$(evt.target).siblings('[data-gimme="post.share-permalink"]');
                    if (visibilityToggle(box)) {
                        var postShare = this.$('[data-gimme^="post.share"][data-gimme!="post.share-permalink"]');
                        visibilityToggle(postShare, false);
                        box.trigger('focus');
                    }
                };
                var permLink = '';
                if (view.permalink && typeof view.permalink === 'function') {
                    permLink = view.permalink();
                    view.$('[data-gimme="post.share-permalink"]').val(permLink);
                }
                view.clientEvents({
                    'click [data-gimme="post.share-permalink"]': 'permalinkInput',
                    'focus [data-gimme="post.share-permalink"]': 'permalinkInput'
                });
                view.permalinkInput = function (evt) {
                    view.$(evt.target).select();
                };
            });
        };
        return plugins.permalink;
    }
});
