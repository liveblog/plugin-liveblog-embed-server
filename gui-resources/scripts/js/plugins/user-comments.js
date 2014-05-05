'use strict';
/*jshint unused: false */
define([
    'plugins',
    'plugins/user-comments-popup',
    'lib/utils',
    'dust',
    'lib/helpers/display-toggle',
    'tmpl!themeBase/plugins/user-comment-message',
    'tmpl!themeBase/plugins/user-comment-backdrop',
    'tmpl!themeBase/plugins/user-comment-action',
    'tmpl!themeBase/plugins/user-comment'
], function (plugins, UserCommentsPopupView, utils, dust, displayToggle) {

    plugins['user-comments'] = function (config) {

        utils.dispatcher.on('config-update.blog-view', function (view) {
            displayToggle(view.$('[data-gimme="blog.comment"]'),
                view.model.get('EmbedConfig').UserComments);
        });

        utils.dispatcher.on('after-render.blog-view', function (view) {
            dust.renderThemed('themeBase/plugins/user-comment-action', {UserComments: view.model.get('EmbedConfig').UserComments}, function(err, out) {
                view.$('[data-gimme="blog.comment-action"]').html(out);
            });

            displayToggle(view.$('[data-gimme="blog.comment"]'), config.UserComments);

            dust.renderThemed('themeBase/plugins/user-comment', {}, function(err, out) {
                view.$('[data-gimme="blog.comment-box"]').html(out);
            });
            dust.renderThemed('themeBase/plugins/user-comment-message', {}, function(err, out) {
                view.$('[data-gimme="blog.comment-box-message"]').html(out);
            });
            dust.renderThemed('themeBase/plugins/user-comment-backdrop', {}, function(err, out) {
                view.$('[data-gimme="blog.comment-box-backdrop"]').html(out);
            });
            if (utils.isClient) {
                var popupView = new UserCommentsPopupView({
                    el: view.el,
                    blogview: view,
                    model: view.model
                });
            }
        });
    };
    return plugins['user-comments'];
});
