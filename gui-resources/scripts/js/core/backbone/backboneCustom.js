// Liveblog custom additions to Backbone.js
/* jshint maxcomplexity:false */
define(['backbone'], function(Backbone){
    'use strict';

    Backbone.defaultSync = Backbone.sync;

    Backbone.sync = function(method, model, options) {

        if (!options) { options = {}; }

        if (method === 'read') {
            // Request a date format that all browsers can parse
            options.headers = {
                'X-Format-DateTime': 'yyyy-MM-ddTHH:mm:ss\'Z\''
            };

            if (model.xfilter) {
                options.headers['X-Filter'] = model.xfilter;
            }
        }
        return Backbone.defaultSync(method, model, options);
    };

    Backbone.defaultAjax = Backbone.ajax;

    Backbone.ajax = function(options){
        if (typeof process !== 'undefined' &&
                process.versions &&
                !!process.versions.node) {
            return Backbone.nodeSync(options);
        }
        return Backbone.defaultAjax(options);
    };

    Backbone.nodeSync = function(options) {

        var request = require('request');

        // Parse response to json
        options.json = true;

        // Use options.success and options.errors callbacks
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
