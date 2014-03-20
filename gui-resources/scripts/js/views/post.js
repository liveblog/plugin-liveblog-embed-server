'use strict';

define([
    'core/utils',
    'views/base-view',
    'views/post-templates'
], function(utils, BaseView) {

    return BaseView.extend({
        // Set el to the top level element from the template
        // instead of default behaviour of inserting a div element.
        el: false,

        socialShareBoxAdded: false,

        initialize: function() {
            utils.dispatcher.trigger('initialize.post-view', this);
            this.setTemplate(this.itemName());
        },

        serialize: function() {
            var data = this.model.toJSON();
            data.baseItem = this.themedTemplate('themeBase/item/base');
            if (this.permalink && typeof this.permalink === 'function') {
                data.permalink = this.permalink();
            }
            return data;
        },

        beforeRender: function() {
            utils.dispatcher.trigger('before-render.post-view', this);
        },

        afterRender: function() {
            utils.dispatcher.trigger('after-render.post-view', this);
        },

        itemName: function() {
            var item,
                post = this.model;

            if (post.get('Author').Source.IsModifiable ===  'True' ||
                post.get('Author').Source.Name === 'internal') {
                if (post.get('Type').Key === 'advertisement') {
                    item = 'item/posttype/infomercial';
                } else {
                    item = 'item/posttype/' + post.get('Type').Key;
                }
            } else if (post.get('Author').Source.Name === 'google') {
                item = 'item/source/google/' + post.get('Meta').type;
            } else {
                if (post.get('Author').Source.Name === 'advertisement') {
                    item = 'item/source/infomercial';
                } else {
                    item = 'item/source/' + post.get('Author').Source.Name;
                }
            }
            this.shortItemName = item;
            return 'themeBase/' + item;
        }
    });
});
