'use strict';

define([
    'underscore',
    'backbone-custom',
    'core/backbone/model-collection-common',
    'core/poller'
], function(_, Backbone, modelCollectionCommon, poller) {

    return Backbone.Model.extend(_.extend({
        // Backbone.Model customizations go here
    }, modelCollectionCommon, poller));
});
