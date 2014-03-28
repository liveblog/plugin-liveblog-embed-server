'use strict';

define([
    'underscore',
    'backbone-custom',
    'lib/backbone/model-collection-common',
    'lib/poller'
], function(_, Backbone, modelCollectionCommon, poller) {

    return Backbone.Model.extend(_.extend({
        idAttribute: 'Id'
    }, modelCollectionCommon, poller));
});
