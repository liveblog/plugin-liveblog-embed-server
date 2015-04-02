'use strict';

define([
    'underscore',
    'backbone-custom',
    'lib/backbone/model-collection-common',
    'lib/poller'
], function(_, Backbone, modelCollectionCommon, poller) {

    return Backbone.Model.extend(_.extend({

        idAttribute: '_id',

        // The function to be called for polling
        poller: function(options) {
            this.fetch(options);
        }
    }, modelCollectionCommon, poller));
});
