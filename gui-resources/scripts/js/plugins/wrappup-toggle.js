/* jshint maxparams: 9 */
'use strict';

define([
    'backbone',
    'underscore',
    'plugins',
    'core/utils',
    'dust'
], function(Backbone, _, plugins, utils, dust) {
    var effects = {
        hide: 'slideUp',
        show: 'slideDown'
    };
    if (utils.isClient){
        utils.dispatcher.once('initialize.posts-view', function(view) {
            view.clientEvents({ 'click [data-gimme="post.wrapup"]': 'wrapupToggle' });
            view.wrapupToggle = function(evt) {
                var item = view.$(evt.target).closest('[data-gimme="post.wrapup"]');
                var wrapupOpen = item.attr('data-wrapup-open');
                if (item.hasClass(wrapupOpen)) {
                    item.removeClass(wrapupOpen);
                    item.nextUntil('[data-gimme="post.wrapup"],[data-gimme="posts.nextPage"]')[effects.hide]();
                } else {
                    item.addClass(wrapupOpen);
                    item.nextUntil('[data-gimme="post.wrapup"],[data-gimme="posts.nextPage"]')[effects.show]();
                }
            };
        });
    }
});
