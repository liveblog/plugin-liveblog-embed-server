'use strict';

define([
    'underscore',
    'backbone-custom',
    'lib/backbone/model-collection-common',
    'lib/poller'
], function(_, Backbone, modelCollectionCommon, poller) {

    return Backbone.Collection.extend(_.extend({

        defaultFilterParams: {
            limit: 15,
            offset: 0,
            lastCId: 0,
            firstOrder: Infinity,
            total: 0
        },

        filterParams: {},

        clearFilterParams: function() {
            this.filterParams = this.defaultFilterParams;
        },

        fetchPage: function(options) {
            options = options || {};
            options.data = _.extend(this.syncParams.pagination, options.data);
            return this.fetch(options);
        },

        fetchUpdates: function(options) {
            options = options || {};
            options.data = _.extend(this.syncParams.updates, options.data);
            return this.fetch(options);
        },

        // The function to be called for polling
        poller: function(options) {
            this.fetchUpdates(options);
        }

    }, modelCollectionCommon, poller));
});
