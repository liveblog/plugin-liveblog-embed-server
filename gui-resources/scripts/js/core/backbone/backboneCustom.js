// Liveblog custom additions to Backbone.js
/* jshint maxcomplexity:false */
'use strict';
define(['backbone'], function(Backbone){

    Backbone.oldSync = Backbone.sync;

    Backbone.sync = function(method, model, options) {

        if (method === 'read')  {
            options.headers = {
                'X-Format-DateTime': 'yyyy-MM-ddTHH:mm:ss\'Z\''
            };

            if (model.xfilter) {
                options.headers['X-Filter'] = model.xfilter;
            }
        }
        return Backbone.oldSync(method, model, options);
    };

    return Backbone;
});
