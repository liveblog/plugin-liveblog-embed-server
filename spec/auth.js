'use strict';

var request = require('request');
var Q = require('q');
var jsSHA = require('jssha');

var getBackendUrl = require("./utils").getBackendUrl


var hashToken = function(username, password, loginToken)
// hash token using username and password
{
; var shaUser = new jsSHA(username, "ASCII")
    , shaPassword = new jsSHA(password, "ASCII")
    , shaStep1 = new jsSHA(shaPassword.getHash("SHA-512", "HEX"), "ASCII")
    , shaStep2 = new jsSHA(loginToken, "ASCII")
    , HashedToken = shaStep1.getHMAC(username, "ASCII", "SHA-512", "HEX")
; return shaStep2.getHMAC(HashedToken, "ASCII", "SHA-512", "HEX")
};


exports.getToken = function()
// acquire auth token using API
{
; var username = protractor.getInstance().params.username
    , password = protractor.getInstance().params.password
    , defer = new Q.defer()
; request.post
( { url: getBackendUrl("/Security/Authentication")
  , json: { 'userName': username }
  }
, function(error, response, json)
  {
  ; var token = json.Token
  ; var hashedToken = hashToken(username, password, token)
  ; request.post
  ( { url: getBackendUrl("/Security/Authentication/Login")
    , json:
      { 'UserName': username
      , 'Token': token
      , 'HashedToken': hashedToken
      }
    }
  , function(error, response, json)
    {
    ; if (error)
      {
      ; defer.reject(new Error(error))
      }
    ; defer.resolve(json.Session)
    }
  )
  }
)
; return defer.promise
};
