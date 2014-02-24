'use strict';

define(['jed'], function(Jed){
    
    var defaults = {
        'locale_data' : {
            'messages' : {
                '' : {
                    'domain': 'messages',
                    'lang': 'en',
                    'plural_forms': 'nplurals=2; plural=(n != 1);'
                }
                // There are no default keys, though
            }
        },
        // The default domain if one is missing
        'domain' : 'messages'
    };
    
    // Add a method to load the messages
    var gettext = new Jed(defaults);
    gettext.loadMessages = function ( messages ) {
        // Some minimal defaults
        var options = defaults;
        options.locale_data.messages = messages;

        this.options = options;
        // Mix in the sent options with the default options
        this.textdomain( 'messages' );
    };
    return gettext;
});