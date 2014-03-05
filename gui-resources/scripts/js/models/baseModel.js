'use strict';

define([
    'underscore',
    'backboneCustom',
    'core/backbone/modelCollectionCommon',
    'core/poller'
], function(_, Backbone, modelCollectionCommon, poller) {

    return Backbone.Model.extend(_.extend({
        // Backbone.Model customizations go here
    }, modelCollectionCommon, poller));
});
