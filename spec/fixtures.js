'use strict';

var request = require('request');

var utils = require("./utils")
var getBackendUrl = utils.getBackendUrl
var UUIDv4 = utils.UUIDv4
var waitUntil = utils.waitUntil
var getIdFromHref = utils.getIdFromHref

var getToken = require("./auth").getToken


function backendRequest(params, callback)
{
; request
( params
, function(error, response, body)
  {
  ; if (error) {throw new Error(error)}
  ; if ( (response.statusCode != 200) && (response.statusCode != 201) )
    {
    ; console.log(body)
    ; throw new Error("Status code: " + response.statusCode)
    }
  ; callback(error, response, body)
  }
)
};


// @TODO: refactor
var responseCounter =
{ newData: function(done, number)
  {
  ; this.number = number
  ; this.done = done
  ; this.counter = 0
  }
, consumeData: function()
  {
  ; this.counter++
  ; if (this.counter == this.number) { this.done() }
  }
}


function resetAppRequest(callback)
{
; backendRequest(
    { url: getBackendUrl("/Tool/TestFixture/default")
    , method: "PUT"
    , json:
      { 'Name': 'default'
      , 'ApplyOnDatabase': true
      , 'ApplyOnFiles': true
      }
    }
  , callback
  )
};


function prepopulateOnePost(token)
{
; backendRequest
( { url: getBackendUrl("/my/LiveDesk/Blog/1/Post")
  , method: 'POST'
  , headers: { Authorization: token }
  , json:
    { 'Meta': {}
    , 'Content': 'test_' + UUIDv4()
    , 'Type': 'normal'
    , 'Creator': '1'
    }
  }
, function(error, response, json)
  {
  ; var id = getIdFromHref(json.href)
  ;
  ; backendRequest
  ( { url: getBackendUrl('/my/LiveDesk/Blog/1/Post/'+id+'/Publish')
    , method: 'POST'
    , headers: { Authorization: token }
    }
  , function(error, response, json)
    {
    ; responseCounter.consumeData()
    }
  )
  }
)
};


exports.resetApp = function(done)
{
; resetAppRequest
(
  function(e,r,b)
  {
  ; done()
  }
)
};


exports.uploadPostFixtures = function(done, number)
{
; number = number || 1
; responseCounter.newData(done, number)
; resetAppRequest
( function(e,r,b)
  {
  ; getToken().then
    (
      function(token)
      {
      ; for (var i=0; i < number ;i++)
        {
        ; prepopulateOnePost(token)
        }
      }
    )
  }
)
};
