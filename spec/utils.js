'use strict';

exports.goto = goto;
exports.getUrl = getUrl;
exports.getBackendUrl = getBackendUrl;

exports.UUIDv4 = function b(a)
{return a
  ?(a^Math.random()*16>>a/4).toString(16)
  :([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,b)
}

exports.getIdFromHref = function(href)
{
; return href.match(/\d+$/g)[0]
}

// construct url from uri
function constructUrl(base, uri){
  return base.replace(/\/$/, '') + uri
}

// construct app url from uri
function getBackendUrl(uri){
  return constructUrl(protractor.getInstance().params.baseBackendUrl, uri)
}
// construct backend url from uri
function getUrl(uri){
  return constructUrl(protractor.getInstance().params.baseUrl, uri)
}

// go to app's uri
function goto(uri) {
    return function() {
        browser.driver.get(getUrl(uri));
	console.log(getUrl(uri))
    };
}
