'use strict';

/*global protractor, browser */

var utils = require('./utils');
var constructUrl = utils.constructUrl;
var constructGetParameters = utils.constructGetParameters;

exports.getUrl = getUrl;
exports.gotoUri = gotoUri;

function getUrl(uri)
{
    return constructUrl(
        protractor.getInstance().params.baseUrl, uri
    );
}

function gotoUri(uri, callback)
// go to app's uri
{
    var result,
        url = exports.getUrl(uri) + constructGetParameters(protractor.getInstance().params.baseGetParams);
    callback = callback || function() {};
    browser.getCurrentUrl().then(
        function(currentUrl) {
            if (url === currentUrl) {
                console.log('[BROWSER] refresh page');
                result = browser.refresh();
            } else {
                console.log('[BROWSER] open ' + url);
                result = browser.driver.get(url);
            }
            callback(result);
        }
    );
}
