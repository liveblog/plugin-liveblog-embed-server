'use strict';

/*global protractor, browser */

var request = require('request');
var constructUrl = require('./utils').constructUrl;

exports.getBackendUrl = function getBackendUrl(uri)
{
    return constructUrl(
        protractor.getInstance().params.baseBackendUrl, uri
    );
};

exports.getUrl = function getUrl(uri)
{
    return constructUrl(
        protractor.getInstance().params.baseUrl, uri
    );
};

exports.gotoUri = function gotoUri(uri)
// go to app's uri
{
    var url = exports.getUrl(uri);
    browser.driver.get(url);
    console.log(url);
};

exports.backendRequest = function(params, callback) {
    if (params.uri) {
        params.url = exports.getBackendUrl(params.uri);
        delete params.uri;
    }
    request(
        params,
        function(error, response, body) {
            if (error) {
                throw new Error(error);
            }
            if (
                (response.statusCode !== 200) && (response.statusCode !== 201)
            ) {
                throw new Error('Status code: ' + response.statusCode);
            }
            callback(error, response, body);
        }
    );
};

exports.backendRequestAuth = function(params, callback) {
    var token = protractor.getInstance().params.token;
    if (!token) {
        throw new Error('No auth token');
    }
    if (!params.headers) {
        params.headers = {};
    }
    params.headers.Authorization = token;
    exports.backendRequest(params, callback);
};
