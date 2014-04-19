'use strict';
/*jshint maxparams: 8 */
define([
    'underscore',
    'backbone',
    'plugins',
    'plugins/user-comments-popup',
    'lib/utils',
    'dust',
    'lib/helpers/displayToggle',
    'tmpl!themeBase/plugins/user-comment-message',
    'tmpl!themeBase/plugins/user-comment-backdrop',
    'tmpl!themeBase/plugins/user-comment-action',
    'tmpl!themeBase/plugins/user-comment'
], function (_, Backbone, plugins, UserCommentsPopupView, utils, dust, displayToggle) {
    plugins['user-comments'] = function (config) {
        if (!config.UserComments) {
            utils.dispatcher.on('after-render.blog-view', function (view) {
                displayToggle(view.$('[data-gimme="blog.comment"]'), false);
            });
        }
        utils.dispatcher.on('config-update.blog-view', function (view) {
            if (view.model.get('EmbedConfig').UserComments) {
                displayToggle(view.$('[data-gimme="blog.comment"]'), true);
            } else {
                displayToggle(view.$('[data-gimme="blog.comment"]'),false);
            }
        });

        utils.dispatcher.on('after-render.blog-view', function (view) {
            dust.renderThemed('themeBase/plugins/user-comment-action', {UserComments: view.model.get('EmbedConfig').UserComments}, function(err, out) {
                view.$('[data-gimme="blog.comment-action"]').html(out);
            });
            dust.renderThemed('themeBase/plugins/user-comment', {}, function(err, out) {
                view.$('[data-gimme="blog.comment-box"]').html(out);
            });
            dust.renderThemed('themeBase/plugins/user-comment-message', {}, function(err, out) {
                view.$('[data-gimme="blog.comment-box-message"]').html(out);
            });
            dust.renderThemed('themeBase/plugins/user-comment-backdrop', {}, function(err, out) {
                view.$('[data-gimme="blog.comment-box-backdrop"]').html(out);
            });
            var popupView = new UserCommentsPopupView({
                el: view.el,
                blogview: view,
                model: view.model
            });
        });
    };
    return plugins['user-comments'];
});