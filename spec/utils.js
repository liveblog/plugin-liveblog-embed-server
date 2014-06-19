'use strict';

exports.goto = goto;
exports.getUrl = getUrl;
exports.getBackendUrl = getBackendUrl;

// construct url from uri
// @TODO: rstrip('/')
function constructUrl(base, uri){
  return base + uri
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
