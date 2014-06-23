var request = require('request');


exports.backendRequest = function(params, callback, token)
{
; if (token)
  { 
  ; if (!params.headers)
    {
    ; params.headers = {}
    }
  ; params.headers.Authorization = token
  }
; request
( params
, function(error, response, body)
  {
  ; if (error) {throw new Error(error)}
  ; if ( (response.statusCode != 200) && (response.statusCode != 201) )
    {
    ; throw new Error("Status code: " + response.statusCode)
    }
  ; callback(error, response, body)
  }
)
}


exports.backendRequestAuth = function(params, callback)
{
; var token = protractor.getInstance().params.token
; if (! token)
  {
  ; throw new Error('No auth token')
  }
; exports.backendRequest(params, callback, token)
};
