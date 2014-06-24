/*global protractor, browser */

'use strict';

var request = require('request');
var constructUrl = require("./utils").constructUrl;

exports.getBackendUrl = function getBackendUrl(uri)
// construct app url from uri
{
  return constructUrl(
    protractor.getInstance().params.baseBackendUrl, uri
  );
};

exports.getUrl = function getUrl(uri)
// construct backend url from uri
{
  return constructUrl(
    protractor.getInstance().params.baseUrl, uri
  );
};

exports.goto = function gotoUri(uri)
// go to app's uri
{
  return function() {
    var url = exports.getUrl(uri);
    browser.driver.get(url);
    console.log(url);
  };
};

exports.backendRequest = function(params, callback, token) {
  if (token) {
    if (!params.headers) {
      params.headers = {};
    }
    params.headers.Authorization = token;
  }
  request(
    params,
    function(error, response, body) {
      if (error) {
        throw new Error(error);
      }
      if ((response.statusCode !== 200) && (response.statusCode !== 201)) {
        throw new Error("Status code: " + response.statusCode);
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
  exports.backendRequest(params, callback, token);
};
