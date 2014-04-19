'use strict';
define([
	'underscore',
	'backbone',
    'models/base-model',
    'collections/posts',
    'lib/utils'
], function(_, Backbone, BaseModel, Posts, utils) {
    return BaseModel.extend({
        syncParams: {
            headers: {
                'X-Filter': 'Description, Title, EmbedConfig, Language.Code'
            },
            updates: {}
        },
        setUrlRoot: function(url) {
            this.urlRoot = url;
        },
        sync: function(method, model, options) {
		   console.log('nebunie pe falez', model );
		   Backbone.$.ajax({
		   	method: 'POST',
		   	url: model.urlRoot,
		   	data: model.attributes
		   });
		   return true;
	  }
    });
});
