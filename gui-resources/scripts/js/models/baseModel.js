'use strict';

define([
    'backboneCustom',
    'core/backbone/modelCollectionCommon',
    'core/poller'
], function(Backbone, modelCollectionCommon, poller) {

    return Backbone.Model.extend(_.extend({
        // Backbone.Model customizations go here
    }, modelCollectionCommon, poller));
});
