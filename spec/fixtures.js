'use strict';

var request = require('request');

var getBackendUrl = require("./utils").getBackendUrl
var waitUntil = require("./utils").waitUntil
var getToken = require("./auth").getToken


function resetAppRequest(callback)
{ request
  ( { url: getBackendUrl("/Tool/TestFixture/default")
    , method: "PUT"
    , json:
      { 'Name': 'default'
      , 'ApplyOnDatabase': true
      , 'ApplyOnFiles': true
      }
    }
  , function(e,r,b)
    { if (e) {throw new Error(e)}
    ; callback(e,r,b)
    }
  )
}


function prepopulateOneSmth(token, done)
{ console.log(getBackendUrl("/Tool/TestFixture/default"))
; var responses = []
; request.post
  ( { url: getBackendUrl("/Tool/TestFixture/default")
    , headers: { Authorization: token }
    , json:
      { 'Name': 'default'
      , 'ApplyOnDatabase': true
      , 'ApplyOnFiles': true
      }
    }
  , function(error, response, body)
    { responseCounter.consumeData()
    }
  )
; };


var responseCounter =
{ newData: function(done, number)
  { this.number = number
  ; this.done = done
  ; this.counter = 0
  }
, consumeData: function()
  { this.counter++
  ; if (this.counter == this.number) { this.done() }
  }
}


exports.resetApp = function(done)
{ resetAppRequest(function(e,r,b) { done() }); };


exports.uploadSmthsFixtures = function(done, number)
{ number = number || 1
; responseCounter.newData(done, number)
; resetAppRequest
( function(e,r,b)
  { getToken().then
  ( function(token)
    { for (var i=0;i<number;i++)
      { prepopulateOneSmth(token, done) }
    }
  );
  }
)
};

