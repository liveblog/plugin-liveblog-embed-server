'use strict';

define([
    'underscore',
    'views/base-view',
    'lib/utils',
    'tmpl!themeBase/item/user'
], function(_, BaseView, utils) {

    return BaseView.extend({

        el: false,

        initialize: function() {

            this.setTemplate('themeBase/item/user');
            this.listenTo(this.model, 'change', this.update);
            this.listenTo(this.model, 'reset', this.setViewOnReset);
            this.model.fetch();
        },

        setViewOnReset: function() {
            this.render();
        },

        update: function() {
            this.render();
        },

        // Backbone.LayoutManager `serialize`.
        serialize: function() {
            return this.model.toJSON();
        }
    });
});
