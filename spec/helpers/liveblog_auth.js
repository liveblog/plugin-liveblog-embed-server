/*global protractor */

'use strict';

var request = require('request');
var jsSHA = require('jssha');
var getBackendUrl = require('./liveblog_common').getBackendUrl;

var hashToken = function(username, password, loginToken)
// hash token using username and password
{
    var shaPassword = new jsSHA(password, 'ASCII'),
        shaStep1 = new jsSHA(shaPassword.getHash('SHA-512', 'HEX'), 'ASCII'),
        shaStep2 = new jsSHA(loginToken, 'ASCII'),
        HashedToken = shaStep1.getHMAC(username, 'ASCII', 'SHA-512', 'HEX');
    return shaStep2.getHMAC(HashedToken, 'ASCII', 'SHA-512', 'HEX');
};

exports.getToken = function(callback)
// acquire auth token using API
{
    var username = protractor.getInstance().params.username,
        password = protractor.getInstance().params.password;
    request.post({
            url: getBackendUrl('/Security/Authentication'),
            json: {
                'userName': username
            }
        },
        function(error, response, json) {
            var token = json.Token;
            var hashedToken = hashToken(username, password, token);
            request.post({
                url: getBackendUrl('/Security/Authentication/Login'),
                json: {
                    'UserName': username,
                    'Token': token,
                    'HashedToken': hashedToken
                }
            }, function(error, response, json) {
                if (error) {
                    throw new Error(error);
                }
                protractor.getInstance().params.token = json.Session;
                callback(error, response, json);
            });
        }
    );
};
