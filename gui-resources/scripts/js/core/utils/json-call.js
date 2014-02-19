'use strict';

define(function(){
    return function(url, callback){
        // if nodejs use require to get the content
        if (typeof process !== 'undefined' &&
                   process.versions &&
                   !!process.versions.node) {
            //Using special require.nodeRequire, something added by r.js.
            var request = require.nodeRequire('request');
            request(url, function(error, response, data) {
                // if everything worked ok parse the content to json.
                if (!error && response.statusCode === 200) {
                    // callback with json parsed as a parameter
                    return callback(JSON.parse(data));
                } else {
                    // Show the error in console so sombody will know that something is wrong.
                    console.log('Error in request: ' + error);
                }
            });
        } else if ((typeof window !== 'undefined' && window.navigator && window.document) || typeof importScripts !== 'undefined') {
            require(['jquery', 'core/jquery/xdomainrequest'], function($){
                $.ajax({
                    dataType: 'json',
                    url: url,
                    error: function(xhr, textStatus, errorThrown){
                        if(textStatus === 'parsererror'){
                            callback(xhr.responseText);
                        }
                    },
                    success: function(data) {
                        // callback with json parsed as a parameter
                        callback(data);
                    }
                });
            });
        }
    };
});