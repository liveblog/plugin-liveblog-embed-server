'use strict';
define([
    'backbone',
    'plugins',
    'plugins/pagination',
    'dust',
    'core/utils',
    'tmpl!themeBase/item/base',
    'tmpl!themeBase/plugins/after-button-pagination',
    'tmpl!themeBase/plugins/before-button-pagination'
], function(Backbone, plugins, paginationPlugin, dust, utils) {

    plugins['button-pagination'] = function(config) {
        var propName = 'display',
            propValue = {'show': 'block', 'hide': 'none'};

        utils.dispatcher.on('initialize.blog-view', function(view) {

            view.clientEvents({'click [data-gimme="posts.to-top"]': 'toTop'});
            view.toTop = function(evt) {
                var self = this,
                new_position = self.el.offset();
                window.scrollTo(new_position.left, new_position.top);
            };
        });

        utils.dispatcher.once('after-render.posts-view', function(view) {
            var data = {};

            data.baseItem = dust.themed('themeBase/item/base');
            dust.renderThemed('themeBase/plugins/before-button-pagination', data, function(err, out) {
                var  el = Backbone.$(out);
                el.css(propName, propValue.hide);
                view.$el.prepend(el);
            });
            dust.renderThemed('themeBase/plugins/after-button-pagination', data, function(err, out) {
                var  el = Backbone.$(out);
                el.css(propName, propValue.hide);
                view.$el.append(el);
            });
        });

        utils.dispatcher.once('after-render.posts-view', function(view) {
            view.checkNextPage();
            view.checkTopPage();
        });

        utils.dispatcher.once('initialize.posts-view', function(view) {
            view.clientEvents({
                'click [data-gimme="posts.nextPage"]': 'buttonNextPage',
                'click [data-gimme="posts.beforePage"]': 'buttonTopPage'
            });

            view.checkTopPage = function(evt) {
                var item = this.$('[data-gimme="posts.beforePage"]');
                if (!this.hasTopPage()) {
                    item.css(propName, propValue.hide);
                } else {
                    item.css(propName, propValue.show);
                }
            };
            view.checkNextPage = function(evt) {
                var item = this.$('[data-gimme="posts.nextPage"]');
                if (!this.hasNextPage()) {
                    item.css(propName, propValue.hide);
                } else {
                    item.css(propName, propValue.show);
                }
            };

            view.buttonNextPage = function(evt) {
                view.flags.buttonNextPage = true;
                var item = view.$('[data-gimme="posts.nextPage"]');
                view.addClass('loading');
                view.nextPage().done(function() {
                    view.flags.buttonNextPage = false;
                    item.removeClass('loading');
                    view.checkNextPage();
                });
            };

            view.buttonTopPage = function(evt) {

                var item = view.$('[data-gimme="posts.beforePage"]');
                item.addClass('loading');
                view.$el
                        .children(':not([data-gimme="posts.beforePage"],[data-gimme="posts.nextPage"])')
                            .remove();
                view.flags.topPage = false;
                view.topPage().done(function() {
                    item.removeClass('loading');
                    item.css(propName, propValue.hide);
                });

            };
        });
    };
    return plugins['button-pagination'];
});
