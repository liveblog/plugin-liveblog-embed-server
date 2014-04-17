/* jshint maxparams: 6 */
'use strict';

liveblog.require = {};
var merge = function(obj, source) {
    if (typeof source !== 'object') {
        return;
    }
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            if (typeof source[key] === 'object'){
                obj[key] = obj[key] ? obj[key] : {};
                merge(obj[key], source[key]);
            } else {
                obj[key] = source[key];
            }
        }
    }
};
var qs = window.location.href;
// if liveblog.dev parameter is there add additional properties.
if ((qs.indexOf('liveblog[dev]') !== -1) || liveblog.dev) {

    // search first into localstorage for liveblog.
    try {
        merge(liveblog, JSON.parse(localStorage.getItem('liveblog')));
    } catch (e){}

    // parse the current location href
    //     for the query parametes that starts with liveblog.
    //     override those properies over the existing global liveblog obj.
    //     parse only first and second level of the object.
    qs.replace(/liveblog\[([^?=&\]]+)\](\[([^?=&\]]+)\])?(=([^&]*))?/g, function (match, key, hasSub, subkey, hasEquality, value) {
        value = decodeURIComponent(value);
        if (hasSub) {
            liveblog[key] = liveblog[key] ? liveblog[key] : {};
            liveblog[key][subkey] = hasEquality ? value : true;
        } else {
            liveblog[key] = hasEquality ? value : true;
        }
    });
}

// if no path for scripts was define use the default path from ally-py implemenation server.
if (!liveblog.paths.scripts) {
    liveblog.paths.scripts = '/content/lib/livedesk-embed/scripts/js/';
}
// method to fix the url for relative protocol and force that protocol.
liveblog.browserUrl = function(urlString) {
    var regxProtocol = /^(http[s]?:)?\/{2}/,
        regxServer = /^(http[s]?:)?\/{2}([0-9.\-A-Za-z]+)(?::(\d+))?/;
    urlString = regxProtocol.test(urlString) ? urlString : '//' + urlString;
    urlString = urlString.replace(regxServer, function(all, protocol, hostname, port) {
        return '//' +
                hostname +
                ((port !== '80' && port !== '443') ? ':' + port : '');
    });
    return urlString;
};
// fix servers frontend url
liveblog.servers.frontend = liveblog.browserUrl(liveblog.servers.frontend);

// after aditional properties where added remake the baseUrl for loader and require.
liveblog.baseUrl = liveblog.require.baseUrl = liveblog.servers.frontend + liveblog.paths.scripts;

// this is the callback after the version was loaded.
liveblog.callbackVersion = function(ver) {
    // add version to require urlArgs.
    liveblog.require.urlArgs = 'version=' + ver.major + '.' + ver.minor + '.' + ver.revision;
    if (liveblog.dev && !liveblog.emulateprod) {
        /*jshint unused:false*/
        // set the require object for development mode.
        var require = liveblog.require;
        liveblog.loadJs('node_modules/requirejs/require').setAttribute('data-main', liveblog.paths.scripts + 'main');
    } else {
        // if is the production then object liveblog.require was already setup.
        liveblog.loadJs('build/main.min');
    }
};

liveblog.loadJs('version');
