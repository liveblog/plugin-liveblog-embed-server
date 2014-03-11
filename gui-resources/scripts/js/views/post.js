'use strict';

define([
    'core/utils',
    'views/baseView',
    'views/post-templates'
], function(utils, BaseView) {

    return BaseView.extend({
        // Set el the to top level element from the template
        // instead of default behaviour of inserting a div element.
        el: false,

        initialize: function() {
            utils.dispatcher.trigger('initialize.post-view',this);
            this.setTemplate(this._postType());
        },

        serialize: function() {
            var data = this.model.toJSON();
            data.baseItem = this.themedTemplate('item/base');
            data.permalink = this.permalink();
            return data;
        },

        _postType: function() {
            var item,
                post = this.model;

            if (post.get('Author').Source.IsModifiable ===  'True' ||
                post.get('Author').Source.Name === 'internal') {
                if (post.get('Type').Key === 'advertisement') {
                    item = 'item/posttype/infomercial';
                }
                else {
                    item = 'item/posttype/' + post.get('Type').Key;
                }
            }
            else if (post.get('Author').Source.Name === 'google') {
                item = 'item/source/google/' + post.get('Meta').type;
            }
            else {
                if (post.get('Author').Source.Name === 'advertisement') {
                    item = 'item/source/infomercial';
                } else {
                    item = 'item/source/' + post.get('Author').Source.Name;
                }
            }
            return item;
        }
    });

});
