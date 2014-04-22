'use strict';
// regex to catch all relevant parts of an url.
//   parameter[1] = protocol if there is one.
//   parameter[2] = hostname.
//   parameter[3] = port if there is one.
//   parameter[4] = pathname if there is one.
//   parameter[5] = pathname if there is one.
//   parameter[6] = hash if there is one.
var urlRegex = /(http[s]?:)?\/{2}([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?/,
    // private method to remove a default 80 port.
    removeDefaultPort = function(urlObj) {
        if(urlObj.port === '80') {
            urlObj.host = urlObj.host.replace(':80', '');
            delete urlObj.port;
        }
        return urlObj;
    },
    // private method to generate an urlString.
    //   fallsback to relative protocol if none.
    formatUrl = function(urlObj) {
        var urlString = (urlObj.protocol ? urlObj.protocol : '') + '//' +
               urlObj.hostname + (urlObj.port ? ':' + urlObj.port : '') +
               (urlObj.pathname ? '/' + urlObj.pathname : '') +
               (urlObj.query ? '?' + urlObj.query : '') +
               (urlObj.hash ? '#' + urlObj.hash : '');
        return urlString;
    };

// api to parse url
var urlHref = {
    // parse the urlString with forceing a href if the urlSring doesn't have a http(s) or relative protocol.
    parseForceHref: function(urlString) {
        var parts, urlObj = {};
        if (!urlRegex.test(urlString)) {
            urlString = '//' + urlString;
        }
        parts = urlString.match(urlRegex);
        if (parts[1]) {
            urlObj.protocol = parts[1];
        }
        urlObj.hostname = parts[2];
        if (parts[3]) {
            urlObj.port = parts[3];
        }
        urlObj.host = urlObj.hostname + (urlObj.port ? ':' + urlObj.port : '');
        if (parts[4]) {
            urlObj.pathname = parts[4];
        }
        if (parts[5]) {
            urlObj.query   = parts[5];
        }
        if (parts[6]) {
            urlObj.hash   = parts[6];
        }
        if (!urlObj.port) {
            urlObj.port = urlObj.protocol && (urlObj.protocol === 'https:') ? '443' : '80';
        }
        urlObj.href = urlString;
        return urlObj;
    },
    // format a urlObj to urlString, forceing a http protocol if the protocol is non or a relative protocol.
    //   nodejs requst module needs a protocol http or https to request a url, relative protocols fails.
    formatServer: function(urlObj) {
        urlObj.protocol = urlObj.protocol ? urlObj.protocol : 'http:';
        urlObj = removeDefaultPort(urlObj);
        return formatUrl(urlObj);
    },
    // format a urlObj to urlString, forceing a relative protocol if the protocol http(s).
    //   a url for browser always need a relative protocol see https bug @LB-1154
    formatBrowser: function(urlObj) {
        delete urlObj.protocol;
        urlObj = removeDefaultPort(urlObj);
        return formatUrl(urlObj);
    },
    // reformat a urlString to a browser relative protocol urlString.
    reformatBrowser: function(urlString) {
        return urlHref.formatBrowser(urlHref.parseForceHref(urlString));
    },
    // reformat a urlString to a nodejs http(s) protocol urlString.
    reformatSever: function(urlString) {
        return urlHref.formatServer(urlHref.parseForceHref(urlString));
    }
};

// Export the Url object for **Node.js** if is in nodjs enviroment.
if (typeof module !== 'undefined' && module.exports) {
    module.exports = urlHref;
}
