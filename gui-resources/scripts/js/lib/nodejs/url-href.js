'use strict';

var urlRegex = /(http[s]?:)?\/{2}([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?/,
    removeDefaultPort = function(urlObj) {
        if(urlObj.port === '80') {
            urlObj.host = urlObj.host.replace(':80', '');
            delete urlObj.port;
        }
        return urlObj;
    },
    formatUrl = function(urlObj) {
        var urlString = (urlObj.protocol ? urlObj.protocol : '') + '//' +
               urlObj.hostname + (urlObj.port ? ':' + urlObj.port : '') +
               (urlObj.pathname ? '/' + urlObj.pathname : '') +
               (urlObj.query ? '?' + urlObj.query : '') +
               (urlObj.hash ? '#' + urlObj.hash : '');
        return urlString;
    };

var urlHref = {
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
    formatServer: function(urlObj) {
        urlObj.protocol = urlObj.protocol ? urlObj.protocol : 'http:';
        urlObj = removeDefaultPort(urlObj);
        return formatUrl(urlObj);
    },
    formatBrowser: function(urlObj) {
        delete urlObj.protocol;
        urlObj = removeDefaultPort(urlObj);
        return formatUrl(urlObj);
    },
    reformatBrowser: function(urlString) {
        return urlHref.formatBrowser(urlHref.parseForceHref(urlString));
    },
    reformatSever: function(urlString) {
        return urlHref.formatServer(urlHref.parseForceHref(urlString));
    }
};

// Export the Url object for **Node.js** if is in nodjs enviroment.
if (typeof module !== 'undefined' && module.exports) {
    module.exports = urlHref;
}
