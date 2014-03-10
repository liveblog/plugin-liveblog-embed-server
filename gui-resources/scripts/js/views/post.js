'use strict';

define([
    'core/utils',
    'views/baseView',
    'dust',
    'views/post-templates'
], function(Utils, BaseView, dust) {

    return BaseView.extend({
        // Set el the to top level element from the template
        // instead of default behaviour of inserting a div element.
        el: false,

        initialize: function() {
            Utils.dispatcher.trigger('initialize.post-view',this);
            this.setTemplate(this.postType());
        },

        serialize: function() {
            var data = this.model.toJSON();
            data.baseItem = dust.themed('item/base');
            return data;
        },

        postType: function() {
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
