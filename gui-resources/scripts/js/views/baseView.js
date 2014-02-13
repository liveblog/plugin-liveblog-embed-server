'use strict';
/* jshint maxcomplexity: false */
define([
    'backbone',
    'dust',
    'backbone.layoutmanager'
], function(Backbone, dust){
    return Backbone.View.extend({
        // Treat all Backbone.View's automatically as
        // Layouts.
        manage: true,

        // Since templates are loaded by Require.js
        // there is no need to 'fetch' them.
        // fetchTemplate just need to return the registered template name.
        fetchTemplate: function(name) {
            return name;
        },

        renderTemplate: function(template, context) {
            // To make it async, call 'async' and store the return value
            // (callback function)
            var done = this.async();

            dust.render(template, context, function(err, out){
                if (err) {
                    // TODO: What do we want to do with the error?
                    throw err;
                } else {
                    done(out);
                }
            });
        }
    });
});
