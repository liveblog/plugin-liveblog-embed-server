'use strict';
liveblog.require = {};

var qs = window.location.href;
// if liveblog.dev parameter is there add additional properties.
if ((qs.indexOf('liveblog.dev') !== -1) || liveblog.dev) {

    // search first into localstorage for liveblog.
    try {
        var storage = JSON.parse(localStorage.getItem('liveblog'));
        for (var key in storage) {
            if (storage.hasOwnProperty(key)) {
                liveblog[key] = storage[key];
            }
        }
    } catch (e){}

    // parse the current location href
    //     for the query parametes that starts with liveblog.
    //     and add those properies over the existing global liveblog obj.
    qs.replace(
        new RegExp('liveblog.([^?=&]+)(=([^&]*))?', 'g'), function(match, key, equality, value) {
            liveblog[key] = equality ? value : true;
        }
    );
}
if (!liveblog.scriptsPath) {
    liveblog.scriptsPath = '/content/lib/livedesk-embed/scripts/js/';
}
if (!liveblog.restServer) {
    liveblog.restServer = liveblog.frontendServer;
}
// after aditional properties where added remake the baseUrl for loader and require.
liveblog.baseUrl = liveblog.require.baseUrl = liveblog.frontendServer + liveblog.scriptsPath;

// this is the callback after the version was loaded.
liveblog.callbackVersion = function(ver) {
    // add version to require urlArgs.
    liveblog.require.urlArgs = 'version=' + ver.major + '.' + ver.minor + '.' + ver.revision;
    if (liveblog.dev) {
        /*jshint unused:false*/
        // set the require object for development mode.
        var require = liveblog.require;
        this.loadJs('node_modules/requirejs/require').setAttribute('data-main', liveblog.scriptsPath + 'main');
    } else {
        // if is the production then object liveblog.require was already setup.
        this.loadJs('build/main.min');
    }
};

liveblog.loadJs('version');
