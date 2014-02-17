'use strict';
// Application configurations
define([], function(){

    var config = {};

    // Liveblog configuration
    config.liveblog = {
        app: {
            // Version is important when used with caching server.
            // revision should be increased for theme control.
            version: {
                major: 0,
                minor: 0,
                revision: 0
            },
            // if application is splited across diffrent servers.
            servers: {
                // this is general applied unless is directly specified.
                protocol: '//',
                // where is the rest api server
                rest: 'localhost:8080',
                // if is needed a separate server for embed.
                frontend: 'localhost:8080'
            }
        }
    };

    // TODO: Set id to the real blog, use '1' as a temporary one
    config.liveblog.id = 1;

    config.liveblog.app.url = config.liveblog.app.servers.protocol + config.liveblog.app.servers.rest + '/resources/LiveDesk/Blog/';

    //config.liveblog.app.url = 'http://liveblog16.sd-test.sourcefabric.org/resources/LiveDesk/Blog/';

    return config;
});
