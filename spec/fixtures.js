'use strict';

var request = require('request');

var getBackendUrl = require("./utils").getBackendUrl
var waitUntil = require("./utils").waitUntil


exports.reset_app = function(done)
{ console.log(getBackendUrl("/Tool/TestFixture/default"))
; request
  ( { url: getBackendUrl("/Tool/TestFixture/default")
    , method: "PUT"
    , headers: { foobar: "string" }
    }
  , function(e,r,b) { done() }
  ).end
  (JSON.stringify(
    { 'Name': 'default'
    , 'ApplyOnDatabase': true
    , 'ApplyOnFiles': true
    })
  )
; };


exports.prepopulate = function(done)
{ console.log(getBackendUrl("/Tool/TestFixture/default"))
; var number = 200
; var responses = []
; for (var i=0; i<number; i++)
  { request
    ( { method: 'PUT'
      , url: getBackendUrl("/Tool/TestFixture/default")
      , headers: { foobar: "string" }
      , body: JSON.stringify(
        { 'Name': 'default'
        , 'ApplyOnDatabase': true
        , 'ApplyOnFiles': true
        })
      }
    , function(error, response, body)
      { responses.push(response)
      ; if (responses.length == number) { done() }
      }
    )
  }
; };
