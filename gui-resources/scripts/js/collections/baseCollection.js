'use strict';

define([
    'underscore',
    'backboneCustom',
    'core/backbone/modelCollectionCommon',
    'core/poller'
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
        }

    }, modelCollectionCommon, poller));
});
