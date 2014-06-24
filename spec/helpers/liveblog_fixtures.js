'use strict';

/*global protractor */

var utils = require('./utils');
var UUIDv4 = utils.UUIDv4;
var getIdFromHref = utils.getIdFromHref;

var getToken = require('./liveblog_auth').getToken;

var liveblogCommon = require('./liveblog_common');
var backendRequest = liveblogCommon.backendRequest;

var liveblogPosts = require('./liveblog_posts.js');
var postCreate = liveblogPosts.postCreate;
var postPublish = liveblogPosts.postPublish;

function resetAppRequest(callback) {
    backendRequest({
        uri: '/Tool/TestFixture/default',
        method: 'PUT',
        json: {
            'Name': 'default',
            'ApplyOnDatabase': true,
            'ApplyOnFiles': true
        }
    }, function(e, r, j) {
        getToken(function(e2, r2, j2) {
            callback(e, r, j);
        });
    });
}

exports.resetApp = function resetApp(done) {
    // ignore empty e,r,j in request callback:
    /*jslint unparam: true */
    resetAppRequest(
        function(e, r, b) {
            done();
        });
    /*jslint unparam: false */
};

function prepopulateOnePost(variableSymbol, callback) {
    variableSymbol = variableSymbol || UUIDv4();
    // ignore empty e,r,j in request callback:
    /*jslint unparam: true */
    postCreate(
        'test_' + variableSymbol,
        function(e, r, json) {
            var id = getIdFromHref(json.href);
            postPublish(id, callback);
        });
    /*jslint unparam: false */
}

exports.uploadPostFixtures = function uploadPostFixtures(done, number) {
    number = number || 1;
    var results = {}, counter = 0,
        i;
    // ignore empty e,r,j in request callback:
    /*jslint unparam: true */
    resetAppRequest(function(e, r, b) {
        for (i = 0; i < number; i++) {
            prepopulateOnePost(
                i + 1, //for readability
                function(e, r, j, id) {
                    results[counter + 1] = id; //here '+1' for readability too
                    counter++;
                    if (counter === number) {
                        protractor.getInstance().params.fixtures = results;
                        done();
                    }
                }
            )
        }
    });
    /*jslint unparam: false */
};
