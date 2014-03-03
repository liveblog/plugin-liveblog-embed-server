'use strict';
/* jshint maxcomplexity: false */
define([
    'backboneCustom',
    'dust',
    'core/utils',
    'backbone.layoutmanager'
], function(Backbone, dust, Utils){
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

        // Backbone events are trrigered on the node and causing error.
        // we use this clientEvents to put events that are only triggered for client.
        clientEvents: {},

        // Apply the clientEvents as the events for client.
        initClientEvent: function() {
            if(Utils.isClient) {
                this.delegateEvents(this.clientEvents);
            }
        },

        // For a given template file name return the template name registered by dust.
        // Return the current theme template if registered, otherwise return the default
        // base theme template.
        // (ex: for 'container' return 'theme/container' or 'themeBase/container')
        themedTemplate: function(name) {
            return dust.cache['theme/' + name] ? ('theme/' + name) : ('themeBase/' + name);
        },

        // Set template view attribute to the current theme template if registered,
        // to base theme template otherwise.
        setTemplate: function(name) {
            this.template = this.themedTemplate(name);
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
