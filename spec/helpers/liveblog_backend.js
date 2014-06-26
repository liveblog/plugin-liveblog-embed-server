'use strict';

/*global protractor */

var request = require('request');

var utils = require('./utils');
var constructUrl = utils.constructUrl;

exports.getBackendUrl = getBackendUrl;
exports.backendRequest = backendRequest;
exports.backendRequestAuth = backendRequestAuth;

function getBackendUrl(uri)
{
    return constructUrl(
        protractor.getInstance().params.baseBackendUrl, uri
    );
}

function backendRequest(params, callback) {
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
}

function backendRequestAuth (params, callback) {
    var token = protractor.getInstance().params.token;
    if (!token) {
        throw new Error('No auth token');
    }
    if (!params.headers) {
        params.headers = {};
    }
    params.headers.Authorization = token;
    exports.backendRequest(params, callback);
}
