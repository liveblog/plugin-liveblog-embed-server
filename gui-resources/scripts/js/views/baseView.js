'use strict';

define([
    'backboneCustom',
    'dust',
    'core/utils',
    'backbone.layoutmanager'
], function(Backbone, dust, utils){
    return Backbone.View.extend({
        // Treat all Backbone.View's automatically as
        // (backbone.layoutManager) Layouts.
        manage: true,

        // For a given template file name return the template name registered by dust.
        // Return the current theme template if registered, otherwise return the default
        // base theme template.
        // (ex: for 'container' return 'theme/container' or 'themeBase/container')
        themedTemplate: function(name) {
            return dust.themed(name);
        },

        // Set template view attribute to the current theme template if registered,
        // to base theme template otherwise.
        setTemplate: function(name) {
            this.template = this.themedTemplate(name);
        },

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
        },

        // Backbone events don't work in the server (node.js)
        // We use this object to store events that should be triggered only client side.
        clientEvents: {},

        // Register clientEvents if in client.
        initClientEvents: function() {
            if(utils.isClient) {
                this.delegateEvents(this.clientEvents);
            }
        }
    });
});
