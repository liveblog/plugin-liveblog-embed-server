'use strict';

var utils = require("./utils")
var UUIDv4 = utils.UUIDv4
var getIdFromHref = utils.getIdFromHref

var getToken = require("./liveblog_auth").getToken

var liveblogCommon = require("./liveblog_common")
var getBackendUrl = liveblogCommon.getBackendUrl
var backendRequest = liveblogCommon.backendRequest
var backendRequestAuth = liveblogCommon.backendRequestAuth


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
, function(e,r,j)
  {
  ; getToken
  ( function(e2,r2,j2)
    {
    ; callback(e,r,j)
    }
  )
  }
)
};


function postPublish(postId, callback)
{
; backendRequestAuth
( { url: getBackendUrl('/my/LiveDesk/Blog/1/Post/'+postId+'/Publish')
  , method: 'POST'
  }
, function(e,r,j)
  {
  ; callback(e,r,j, postId)
  }
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


function prepopulateOnePost(variableSymbol, callback)
{
; variableSymbol = variableSymbol || UUIDv4()
; postCreate
( 'test_' + variableSymbol
, function(e, r, json)
  {
  ; var id = getIdFromHref(json.href)
  ; postPublish(id, callback)
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
; var results = {}
    , counter = 0
; resetAppRequest
( function(e,r,b)
  {
  ; for (var i=0; i < number ;i++)
    {
    ; prepopulateOnePost
    ( i + 1 //for readability
    , function(e,r,j, id)
      {
      ; results[counter + 1] = id //here "+1" for readability too
      ; counter++
      ; if (counter == number)
        {
        ; protractor.getInstance().params.fixtures = results
        ; done()
        }
      }
    )
    }
  }
)
};
