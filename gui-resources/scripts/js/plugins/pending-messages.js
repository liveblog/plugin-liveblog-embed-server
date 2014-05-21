'use strict';
define([
    'lib/gettext',
    'plugins',
    'lib/utils',
    'dust',
    'tmpl!themeBase/item/base',
    'tmpl!themeBase/plugins/pending-items-message'
], function (gt, plugins, utils, dust) {
            plugins.pendingMessages = function (config) {
                var blogView = {};
                utils.dispatcher.once('initialize.blog-view', function(view) {
                    //retain the blog view for future reference
                    blogView = view;
                });
                utils.dispatcher.once('after-render.blog-view', function(view) {
                    //add the markup for pending messages
                    dust.renderThemed('themeBase/plugins/pending-items-message', {}, function(err, out) {
                        view.$('[data-gimme="posts.pending-message-placeholder"]').html(out);
                    });
                });
                if (utils.isClient) {
                    utils.dispatcher.once('initialize.posts-view', function(view) {
                        //method to pause the auto rendering
                        view.pauseAutoRender = function() {
                            view.flags.autoRender = false;
                        };
                        //method to resume the auto rendering
                        view.resumeAutoRender = function() {
                            view.flags.autoRender = true;
                        };
                        //add the click event handler for the new items message
                        blogView.$el.on('click', '[data-gimme="posts.pending-message"]', function() {
                            view.renderPending();
                        });
                    });
                    //when the pending posts are rendered remove the new posts link
                    utils.dispatcher.on('rendered-pending.posts-view', function(view) {
                        blogView.$('[data-gimme="posts.pending-message"]').html('').toggle(false);
                    });
                    //when new pending posts are added, show the appropriate message
                    utils.dispatcher.on('add-pending.posts-view', function(view) {
                        var message = '', pending = view.pendingCounter;
                        message = gt.sprintf(gt.ngettext('one new post', '%(count)s new posts', pending), {count: pending});
                        blogView.$('[data-gimme="posts.pending-message"]').html(message).toggle(true);
                    });
                }
            };
            return plugins.pendingMessages;
        });
