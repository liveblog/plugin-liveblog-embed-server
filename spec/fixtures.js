'use strict';

var utils = require("./utils")
var getBackendUrl = utils.getBackendUrl
var UUIDv4 = utils.UUIDv4
var waitUntil = utils.waitUntil
var getIdFromHref = utils.getIdFromHref

var getToken = require("./auth").getToken

var backendRequest = require("./helpers/liveblog_common.js").backendRequest
var backendRequestAuth = require("./helpers/liveblog_common.js").backendRequestAuth


exports.resetApp = resetApp
exports.uploadPostFixtures = uploadPostFixtures


function resetAppRequest(callback)
{
; backendRequest
( { url: getBackendUrl("/Tool/TestFixture/default")
  , method: "PUT"
  , json:
    { 'Name': 'default'
    , 'ApplyOnDatabase': true
    , 'ApplyOnFiles': true
    }
  }
, function(e,r,b)
  {
  ; getToken().then
  ( function(t)
    {
    ; protractor.getInstance().params.token = t
    ; callback(e,r,b)
    }
  )
  }
)
};


var responseCounter = function(done, number)
{
; this.done = done
; this.number = number
; this.counter = 0
; this.result = {}
; this.consumeData = function(variableSymbol, id)
  {
  ; this.result[variableSymbol] = id
  ; this.counter++
  ; if (this.counter == this.number)
    {
    ; protractor.getInstance().params.fixtures = this.result
    ; this.done()
    }
  }
}


function postPublish(postId, callback)
{
; backendRequestAuth
( { url: getBackendUrl('/my/LiveDesk/Blog/1/Post/'+postId+'/Publish')
  , method: 'POST'
  }
, callback
)
}


function postCreate(postContent, callback)
{
; backendRequestAuth
( { url: getBackendUrl("/my/LiveDesk/Blog/1/Post")
  , method: 'POST'
  , json:
    { 'Meta': {}
    , 'Content': postContent
    , 'Type': 'normal'
    , 'Creator': '1'
    }
  }
, function(e,r,j)
  {
  ; callback(e,r,j)
  }
)
}


function prepopulateOnePost(responseCounterInstance, variableSymbol)
{
; variableSymbol = variableSymbol || UUIDv4()
; postCreate
( 'test_' + variableSymbol
, function(e, r, json)
  {
  ; var id = getIdFromHref(json.href)
  ; postPublish
  ( id
  , function(e,r,j)
    {
    ; responseCounterInstance.consumeData(variableSymbol, id)
    }
  )
  }
)
};


function resetApp(done)
{
; resetAppRequest
( function(e,r,b)
  {
  ; done()
  }
)
};


function uploadPostFixtures(done, number)
{
; number = number || 1
; var responseCounterInstance = new responseCounter(done, number)
; resetAppRequest
( function(e,r,b)
  {
  ; for (var i=0; i < number ;i++)
    {
    ; prepopulateOnePost(responseCounterInstance, i+1)
    }
  }
)
};
