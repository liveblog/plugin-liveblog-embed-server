'use strict';

define([
    'lib/utils',
    'views/base-view',
    'views/post-templates'
], function(utils, BaseView) {

    return BaseView.extend({
        // Set el to the top level element from the template
        // instead of default behaviour of inserting a div element.
        el: false,
        // Where we cache some data.
        //   for now is used for cacheing the itemName after the compilation of it.
        _cacheData: {
            itemName: false
        },
        socialShareBoxAdded: false,

        initialize: function() {
            utils.dispatcher.trigger('initialize.post-view', this);
            this.setTemplate(this.itemName());
            this.order = parseFloat(this.model.get('Order'));
            this.listenTo(this.model, 'change:CId', this.update);
        },

        // If the model changed re-render the view, except if one of the changed
        // attributes was 'Order', in which case the event will be handle by posts view
        update: function() {
            if (!this.model.hasChanged('Order')) {
                this.render();
            }
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
            if(this._cacheData.itemName) {
                return this._cacheData.itemName;
            }
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
            this._cacheData.itemName = 'themeBase/' + item;
            return this._cacheData.itemName;
        }
    });
});
