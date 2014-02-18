// Liveblog custom additions to Backbone.js
/* jshint maxcomplexity:false */
'use strict';
define(['backbone'], function(Backbone){

    Backbone.oldSync = Backbone.sync;

    Backbone.sync = function(method, model, options) {

        if (!options) { options = {}; }

        if (method === 'read') {

            // Set headers
            options.headers = {
                // Date format that all browsers can parse
                'X-Format-DateTime': 'yyyy-MM-ddTHH:mm:ss\'Z\''
            };

            if (model.xfilter) {
                options.headers['X-Filter'] = model.xfilter;
            }

            // Don't use default Backbone.sync for node.js
            if (typeof process !== 'undefined' &&
                    process.versions &&
                    !!process.versions.node) {
                return Backbone.nodeRequest(method, model, options);
            }
        }
        return Backbone.oldSync(method, model, options);
    };

    Backbone.nodeRequest = function(method, model, options) {

        var request = require('request');

        options.url = model.url();
        options.json = true;

        // Use options.success and options.errors callbacks
        // for compatibility with Backbone
        request.get(options, function(error, response, data) {
            if (!error && response.statusCode === 200) {
                if (options.success) {
                    return options.success(data);
                }
            } else if(options.error) {
                return options.error(response);
            }
        });
    };

    return Backbone;
});
