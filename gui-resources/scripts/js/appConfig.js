'use strict';
// Application configurations
// -------------
// Liveblog configuration
liveblog.app = {
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
};

liveblog.app.url = liveblog.app.servers.protocol + liveblog.app.servers.rest + '/resources/LiveDesk/Blog/1/Post/Published/?X-Filter=*&limit=1000';