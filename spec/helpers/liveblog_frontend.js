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

function gotoUri(uri)
// go to app's uri
{
    var url = exports.getUrl(uri) + constructGetParameters(protractor.getInstance().params.baseGetParams);
    browser.driver.get(url);
    console.log(url);
}
