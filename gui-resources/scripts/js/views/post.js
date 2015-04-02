'use strict';

define([
    'underscore',
    'lib/utils',
    'views/base-view',
    'views/user',
    'lib/lodash/defaults-deep',
    'views/post-templates'
], function(_, utils, BaseView, UserView) {

    return BaseView.extend({

        // Set `el` to the top level element from the template
        // instead of the default behaviour of inserting a `div` element
        // (Backbone.LayoutManager).
        el: false,
        // The selector of the view root element.
        userSel: '[data-gimme="post.username"]',

        initialize: function() {
            _.defaultsDeep(this, this.propertiesObj);
            this.order = parseFloat(this.model.get('Order'));

            utils.dispatcher.trigger('initialize.post-view', this);

            this.setTemplate('themeBase/item/' + this.model.get('item'));

            this.listenTo(this.model, 'change:CId', this.update);

            var userView = new UserView({model: this.model.get('user')});
            this.setView(this.userSel, userView);
        },

        // If the model has changed re-render the view,
        // except if the post was reordered,
        // unpublished or deleted, in which case the
        // event will be handled by posts view.
        update: function() {
            if (!this.model.hasChanged('deleted')) {
                this.render();
            }
        },

        // Backbone.LayoutManager `serialize`.
        serialize: function() {
            var data = this.model.toJSON();
            data.baseItem = this.themedTemplate('themeBase/item/base');
            if (this.permalink && typeof this.permalink === 'function') {
                data.permalink = this.permalink();
            }
            return data;
        },

        // To be called client side if the post has been already
        // rendered server side.
        // It manually set fields and throw events as if `render`
        // had been executed.
        alreadyRendered: function() {
            this.fakeViewRendering();
            utils.dispatcher.trigger('before-render.post-view', this);
            utils.dispatcher.trigger('after-render.post-view', this);
        },

        // Backbone.LayoutManager `beforeRender`.
        beforeRender: function() {
            utils.dispatcher.trigger('before-render.post-view', this);
        },

        // Backbone.LayoutManager `afterRender`.
        afterRender: function() {
            utils.dispatcher.trigger('after-render.post-view', this);
        }
    });
});
